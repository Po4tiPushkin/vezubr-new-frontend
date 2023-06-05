import { observable, computed, action, toJS } from 'mobx';
import { computedFn } from 'mobx-utils';
import { treeConvertTreeToList } from '@vezubr/common/utils';
import Doc from './Doc';

class Store {
  @observable _editable = false;

  @observable _showComments = false;

  @observable _showAccept = false;

  @observable _newApi = false

  _docs = observable.map([], { deep: false });

  _groups = observable.map([]);

  _onChange = null;

  _onInit = null;

  constructor({ documents, groups, editable, onChange, onInit, showComments, showAccept, newApi = false } = {}) {
    this.setEditable(editable);
    if (onInit) {
      this.setOnInit(onInit);
    }
    this.setDocsAndGroups(documents, groups);
    this.setShowComments(showComments);
    this.setShowAccept(showAccept);
    this.setNewApi(newApi)
    if (onChange) {
      this.setOnChange(onChange);
    }
  }

  @action
  setOnInit(func) {
    this._onInit = func;
  }

  @action
  setOnChange(func) {
    this._onChange = func;
  }

  @action
  setNewApi(newApi) {
    this._newApi = newApi
  }

  @action
  onChange(fileDataInput, action) {
    const fileData = toJS(fileDataInput);
    if (this._onChange) {
      this._onChange({ fileData, action }, this.files, this);
    }
  }

  get files() {
    const files = [];
    for (const [, doc] of Array.from(this._docs)) {
      const { category, point } = doc;
      for (const [, file] of doc.files) {
        const { fileId, orderDocumentId } = file
        files.push({
          category,
          fileId,
          point,
          orderDocumentId
        });
      }
    }
    return files;
  }

  @action
  setDocsAndGroups(documents, groups) {
    this._docs.clear();
    this._groups.clear();

    function setVisibleGroup(gMap, idInput) {
      const ids = Array.isArray(idInput) ? idInput : [idInput];
      for (const id of ids) {
        let currentId = id;
        while (gMap.has(currentId)) {
          const gValue = gMap.get(currentId);
          gMap.set(currentId, { ...gValue, visible: true });
          currentId = gValue.parentId;
        }
      }
    }

    const groupMap = new Map(treeConvertTreeToList({ tree: groups }).map((g) => [g.id, { ...g, visible: false }]));

    const entryVisibleIds = [];

    for (const doc of documents) {
      let groupId = null;
      for (const [id, group] of groupMap) {
        if (group.predicate && group.predicate(doc)) {
          entryVisibleIds.push(id);
          groupId = group.id;
          break;
        }
      }

      const docObject = new Doc({ ...doc, groupId }, this);
      this._docs.set(docObject.id, docObject);
    }

    setVisibleGroup(groupMap, entryVisibleIds);

    for (const [id, group] of groupMap) {
      const { visible, ...groupData } = group;
      if (visible) {
        this._groups.set(id, groupData);
      }
    }

    if (this._onInit) {
      this._onInit(this.files, this);
    }
  }

  @action
  setEditable(flag) {
    this._editable = !!flag;
  }

  @action
  setShowComments(flag) {
    this._showComments = !!flag;
  }

  @action
  setShowAccept(flag) {
    this._showAccept = !!flag;
  }

  @computed
  get editable() {
    return this._editable;
  }

  @computed
  get showComments() {
    return this._showComments;
  }

  @computed
  get showAccept() {
    return this._showAccept;
  }

  @computed
  get newApi() {
    return this._newApi;
  }

  getGroupsByParentId = computedFn(function (parentId) {
    return Array.from(this._groups).filter(([, group]) => group.parentId === parentId);
  });

  getDocsByGroupId = computedFn(function (groupId) {
    return Array.from(this._docs).filter(([, doc]) => doc.groupId === groupId);
  });
}

export default Store;
