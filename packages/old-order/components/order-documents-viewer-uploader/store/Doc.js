import {
  observable,
  computed,
  action
} from 'mobx';
import {
  uuid
} from "@vezubr/common/utils";

class Doc {

  _files = observable.map([]);

  _comments = observable.map([]);

  @observable
  _accepted = true;

  _store = null;

  id = uuid();

  groupId = null;

  category = null;

  loadingType = [];

  max = 0;

  min = 0;

  point = null;

  required = false;

  constructor({
    files,
    comment = [],
    groupId,
    ...otherParams
  } = {}, store) {
    this._setFiles(files);
    this._comments = comment;
    this.groupId = groupId;
    this._updateData(otherParams)
    this._store = store;
  }

  @action
  _updateData(data) {
    Object.assign(this, data);
  }

  @action
  _setFiles(files) {
    this._files.clear();
    for (const file of files) {
      this._files.set(uuid(), file);
    }
  }

  @computed
  get canAddFiles() {
    return !this.max || this.max > this.files.length
  }

  @computed
  get files() {
    return Array.from(this._files);
  }

  @action
  addFile(file, id = uuid()) {
    if (!this.canAddFiles) {
      return;
    }
    this._files.set(id, file);
    this._store.onChange([file], 'add-file');
  }

  @action
  addFiles(files) {
    if (!this.canAddFiles) {
      return;
    }

    const maxToAdd = Math.min(this.max - this.files.length, files.length);
    const added = [];

    for (let index = 0; index < maxToAdd; index++) {
      added.push(files[index]);
      this._files.set(uuid(), files[index]);
    }

    if (added.length > 0) {
      this._store.onChange(added, 'add-files');
    }
  }

  @action
  deleteFile(id) {
    const file = this._files.get(id);
    this._files.delete(id);
    this._store.onChange([file], 'remove-file');
  }

  @action
  updatedFile(id, updated) {
    const updatedFile = {
      ...this._files.get(id),
      ...updated
    };

    this._files.set(id, updatedFile);
    this._store.onChange([updatedFile], 'updated-files');
  }

  @action
  addComment(comment, id = uuid()) {
    this._comments.set(id, comment);
    this._store.onChange([comment], 'add-comments');
  }
  
  @computed
  get comments() {
    return Array.from(this._comments);
  }

  //
  // @action
  // accept(doc) {
  //   this._store.onChange([doc], 'accept');
  // }
  //
  // @computed
  // get isAccepted() {
  //   return this._accepted;
  // }

}





export default Doc;