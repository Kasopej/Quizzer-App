export class PersistenceServiceClass {}

export class LocalDataPersistenceClass extends PersistenceServiceClass {
  saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  getData(key) {
    return JSON.parse(localStorage.getItem(key));
  }
  removeData(key) {
    localStorage.removeItem(key);
  }
  clear() {
    localStorage.clear();
  }
}

export class SessionStoragePersistenceClass extends PersistenceServiceClass {
  saveData(key, data) {
    sessionStorage.setItem(key, JSON.stringify(data));
  }
  getData(key) {
    return JSON.parse(sessionStorage.getItem(key));
  }
}
