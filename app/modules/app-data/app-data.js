export class AppDataClass { //This is a base class class to provide basic properties & methods fir data the app needs to operate
    constructor(obj = {}) {
        this._configData = obj;
        this._configDataClonesMap = new Map()
    }
    updateData() {

    }
    clearData() {
        this._data = undefined;
    }
    getData() {
        return this._data
    }
    getConfigData() {
        return this._configData
    }
    set configData(obj = {}) {
        this._configData = obj;
    }
    mapConfigDataClone(key) { //clones configData map so different consumers can have independent configData instances
        this._configDataClonesMap.set(key, _.cloneDeep(this._configData));
    }
    getConfigDataClone(key) { //returns independent configData instances if key is passed, else returns the map of configData instances
        this._configDataClonesMap.get(key);
        if (arguments.length == 1) {
            return this._configDataClonesMap.get(key);
        }
        return this._configDataClonesMap;
    }
}

export class QuizzerDataClass extends AppDataClass { //Extension of base AppData class to provide functionality specific to quizzer
    constructor() {
        super();
        this._data = new Map();
    }
    updateData(...entries) {
        entries.forEach(entry => {
            this._data.set(entry[0], entry[1])
        })
    }
    updateConfigData = (...entries) => {
        entries.forEach(entry => {
            this._configData[entry[0]] = entry[1];
        })
    }
    getData(key) {
        if (arguments.length == 1) {
            return super.getData().get(key)
        }
        return super.getData()
    }
    getConfigData(key) {
        if (arguments.length == 1) {
            return super.getConfigData()[key];
        }
        return super.getConfigData();
    }
}