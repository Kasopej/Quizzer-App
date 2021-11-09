export default class setupDataController {
    setConfigurationDataMap(...entries) { //argument passed should be sent as array, which will then be copied into entry array (entries like format)
        entries.forEach(
            (entry) => {
                if (this._configurationDataMap) {
                    this._configurationDataMap.set(entry[0], entry[1]);
                }
                else {
                    this._configurationDataMap = new Map().set(entry[0], entry[1]);
                }
            }
        )
    }
    getConfigurationDataMap() {
        return this._configurationDataMap;
    }
    addToLocalStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value))
    }
    getFromLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }
    clearLocalStorage() {
        localStorage.clear();
    }
}