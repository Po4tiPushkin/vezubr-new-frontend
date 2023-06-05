class Utils {
  static serializeUpdate(userId, data) {
    data.userId = userId;
    data.role = data.type;
    delete data.type;
    return data;
  }

  static serializeDeletingData(data) {
    data.userId = data.id;
    delete data.id;
    return data;
  }

  static serializeAdd(data) {
    data.role = data.type;
    delete data.type;
    return data;
  }

  static deserializeUsers(users) {
    return users.map((u) => {
      u.type = u.role;
      return u;
    });
  }
}

export default Utils;
