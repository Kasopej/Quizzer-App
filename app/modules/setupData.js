export default class setupDataController {
    get configurationDataMap() {
        this._configurationDataMap = new Map();
        return this._configurationDataMap;
    }
    addToLocalStorage(key, value = undefined) {
        localStorage.setItem(JSON.stringify(key), JSON.stringify(value))
    }
}