export class AppDataClass {
    constructor(obj = {}) {
        this._configData = obj;
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
}

export class QuizzerDataClass extends AppDataClass {
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
        else return super.getData()
    }
    getConfigData(key) {
        if (arguments.length == 1) {
            return super.getConfigData()[key];
        }
        else return super.getConfigData();
    }
}