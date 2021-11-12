export class AppLocalData {
    constructor(data) {
        this._data = data;
    }
    getData() {
        return this._data
    }
}

export class quizzerLocalData extends AppLocalData {
    constructor(data = []) {
        super(data);
    }
}