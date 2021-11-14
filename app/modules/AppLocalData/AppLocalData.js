export class AppLocalDataClass {
    getData() {
        return this._data
    }
    setData() {

    }
    clearData() {
        this._data = undefined;
    }
    getConfigData() {
        return this._configData
    }
    setConfigData() {

    }
}

export class quizzerLocalDataClass extends AppLocalDataClass {
    constructor() {
        super();
        this._data = new Map();
        this._configData = new Map()
    }
    getData(key) {
        if (arguments.length == 1) {
            return super.getData().get(key)
        }
        else return super.getData()
    }
    setData(...entries) {
        entries.forEach(entry => {
            this._data.set(entry[0], entry[1])
        })
    }
    setConfigData = (...entries) => {
        entries.forEach(entry => {
            this._configData.set(entry[0], entry[1])
        })
    }
    getConfigData(key) {
        if (arguments.length == 1) {
            return super.getConfigData().get(key)
        }
        else return super.getConfigData()
    }
}