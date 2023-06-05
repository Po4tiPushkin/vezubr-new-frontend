import { observable, computed, action } from 'mobx';
import { computedFn } from 'mobx-utils';
import _difference from 'lodash/difference';
import { isNumber } from '@vezubr/common/utils';
import { LOADERS_KEYS_TO_ARTICLES, UNEDITABLE_ARTICLES } from '../constants';

function getDataFromDetails(details, dictionaries) {
  const articles = [];
  const costPerItemHash = {};
  const quantityHash = {};
  const summaryHash = {};
  let vatRateHash = {};
  for (const detail of details) {
    const { article, costPerItem, quantity, summary, vatRate } = detail;

    articles.push(~~article);

    if (costPerItem) {
      costPerItemHash[article] = costPerItem;
    }

    if (quantity) {
      quantityHash[article] = quantity;
    }

    if (summary) {
      summaryHash[article] = summary;
    }

    if (vatRate) {
      vatRateHash = Object.entries(dictionaries?.orderServices)?.reduce((acc, [key, value]) => {
        if (!acc[key]) {
          acc[key] = value.vatPercent || 0;
        }
        return acc;
      }, {});
    }
  }

  return {
    articles,
    costPerItem: costPerItemHash,
    quantity: quantityHash,
    summary: summaryHash,
    vatRate: vatRateHash,
  };
}

class OrderPaymentDetails {
  @observable _articles_init = [];
  @observable _quantity_init = {};
  @observable _costPerItem_init = {};

  @observable _articles = [];
  @observable _quantity = {};
  @observable _costPerItem = {};
  @observable _summary = {};
  @observable _editable = false;
  @observable _vatRate = {};
  @observable withVatRate = false;
  @observable _loaders = {};
  @observable _loaders_init = {};

  orderServices;
  orderType;
  tariffServiceCost;

  constructor({
    params,
    details,
    editable,
    withVatRate,
    startedAt,
    completedAt,
    loaders,
    tariffServiceCost,
    dictionaries,
  } = {}) {
    if (params) {
      this.updated(params);
    }
    if (loaders) {
      let newLoaders = Object.entries(loaders).reduce((acc, [key, value]) => {
        if (!acc[LOADERS_KEYS_TO_ARTICLES[key]]) {
          acc[LOADERS_KEYS_TO_ARTICLES[key]] = value;
        }
        return acc;
      }, {});

      this._loaders = newLoaders;
    }
    if (details) {
      this.setInitial(details, dictionaries);
    }

    this.withVatRate = withVatRate;
    this.tariffServiceCost = tariffServiceCost;
    this.setStartedAt(startedAt);
    this.setCompletedAt(completedAt);

    this.setEditable(editable);
  }

  @action
  setEditable(flag) {
    this._editable = !!flag;
  }

  @computed
  get editable() {
    return this._editable;
  }

  @computed
  get vatRate() {
    return this._vatRate;
  }

  @action
  getLoaders(article) {
    return this._loaders[article];
  }
  @action
  getAllLoaders() {
    return this._loaders;
  }
  @action
  getLoadersPrev(article) {
    return this._loaders_init[article];
  }
  @action
  setLoaders(article, value) {
    let newLoaders = { ...this._loaders };
    newLoaders[article] = value;
    this._loaders = newLoaders;
  }

  getCostPerItem = computedFn(function (article) {
    return this._costPerItem[article];
  });

  @observable _startedAt = null;

  get startedAt() {
    return this._startedAt;
  }

  setStartedAt(startedAt) {
    this._startedAt = startedAt;
  }

  @observable _completedAt = null;

  get completedAt() {
    return this._completedAt;
  }

  setCompletedAt(completedAt) {
    this._completedAt = completedAt;
  }

  canEditCostPerItem = computedFn(function (article) {
    return !UNEDITABLE_ARTICLES.includes(article);
  });

  setSummary(article) {
    this._summary[article] = this._costPerItem[article] * (this._quantity[article] || 1);
  }

  @action
  setCostPerItem(article, value) {
    this._costPerItem[article] = isNumber(value) ? value : 0;
    this.setSummary(article);
  }

  getCostPerItemPrev = computedFn(function (article) {
    const costPerItem = this._costPerItem[article];
    const costPerItemInit = this._costPerItem_init[article];

    if (costPerItem && costPerItemInit && costPerItemInit !== costPerItem) {
      return costPerItemInit;
    }

    return null;
  });

  getQuantity = computedFn(function (article) {
    return this._quantity[article];
  });

  @action
  setQuantity(article, value) {
    this._quantity[article] = isNumber(value) ? value : 1;
    this.setSummary(article);
  }

  getQuantityPrev = computedFn(function (article) {
    const quantity = this._quantity[article];
    const quantityInit = this._quantity_init[article];

    if (quantity && quantityInit && quantityInit !== quantity) {
      return quantityInit;
    }

    return null;
  });

  @action
  getSummary(article) {
    if (this._summary[article]) {
      return this._summary[article];
    }
  }
  @action
  setInitial(details, dictionaries) {
    const { articles, costPerItem, quantity, summary, vatRate } = getDataFromDetails(details, dictionaries);

    this._articles_init = articles;
    this._quantity_init = quantity;
    this._costPerItem_init = costPerItem;
    this._loaders_init = { ...this._loaders };

    this._articles = articles;
    this._quantity = quantity;
    this._costPerItem = costPerItem;
    this._summary = summary;
    this._vatRate = vatRate;
  }
  article;
  quantity;
  costPerItem;
  summary;

  getDetails() {
    return this._articles.map((article) => ({
      article,
      quantity: this._quantity[article],
      costPerItem: this._costPerItem[article],
      vatRate: this._vatRate,
    }));
  }

  @computed
  get articles() {
    return [...this._articles];
  }

  canDeleteArticle = computedFn(function (article) {
    return !UNEDITABLE_ARTICLES.includes(article);
  });

  @action
  addArticle(article) {
    this._articles.push(article);
    this._quantity[article] = 1;
    const autoCost = this.tariffServiceCost?.find((item) => article == item.article)?.costPerService || 0;
    if (this._vatRate[article]) {
      this._costPerItem[article] = autoCost + (autoCost * this._vatRate[article]) / 100;
    } else {
      this._costPerItem[article] = autoCost;
    }
  }

  @action
  deleteArticle(article) {
    this._articles = this._articles.filter((a) => a !== article);
    delete this._quantity[article];
    delete this._costPerItem[article];
    delete this._loaders[article];
  }

  @computed
  get availableArticles() {
    return _difference(
      Object.keys(this.orderServices).map((article) => ~~article),
      this._articles,
      Object.values(this.orderServices)
        .filter(({ orderTypes, isActual }) => !isActual || !orderTypes.includes(this.orderType))
        .map(({ article }) => ~~article),
    );
  }

  @computed
  get hasAvailableArticles() {
    return this.availableArticles.length > 0;
  }

  @computed
  get total() {
    let total = 0;
    for (const article of this._articles) {
      if (this._summary[article]) {
        total += this._summary[article];
      } else if (this._costPerItem[article]) {
        total += (this._quantity[article] || 1) * this._costPerItem[article];
      }
    }
    return total;
  }
  @computed
  get totalWithoutVat() {
    let total = 0;
    for (const article of this._articles) {
      if (this._summary[article]) {
        total += (this._summary[article] * 100) / (100 + (this._vatRate[article] || 0));
      } else if (this._costPerItem[article]) {
        total +=
          ((this._quantity[article] || 1) * this._costPerItem[article] * 100) / (100 + (this._vatRate[article] || 0));
      }
    }
    return total;
  }

  @action
  updated(params) {
    Object.assign(this, params);
  }
}

export default OrderPaymentDetails;
