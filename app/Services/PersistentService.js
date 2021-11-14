export class PersistenceServiceClass {

}

export class LocalDataPersistenceClass extends PersistenceServiceClass {
    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    getData(key) {
        return JSON.parse(localStorage.getItem(key));
    }
}