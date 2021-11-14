export class PersistenceServiceClass {

}

export class LocalDataPersistenceClass extends PersistenceServiceClass {
    saveToLocalData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    getFromLocalData(key) {
        return JSON.parse(localStorage.getItem(key));
    }
}