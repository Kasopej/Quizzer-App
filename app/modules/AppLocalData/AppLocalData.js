export class AppLocalDataClass {
    getData() {
        return this._data
    }
    setData() {

    }
    clearData() {
        this._data = undefined;
    }
}

export class quizzerLocalDataClass extends AppLocalDataClass {
    constructor() {
        super();
        this._data = new Map()
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
}