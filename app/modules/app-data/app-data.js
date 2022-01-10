//This module is to keep and provide data the app needs to operate
export class AppDataClass {
  //base class that QuizzerDataClass is extended from. Allows for logical extension of application beyond quizzer solution
  constructor(obj = {}) {
    this._configData = obj;
    this._configDataClonesMap = new Map();
  }
  updateData() {}
  clearData() {
    this._data = undefined;
  }
  getData() {
    return this._data;
  }
  getConfigData() {
    return this._configData;
  }
  set configData(obj = {}) {
    this._configData = obj;
  }
  mapConfigDataClone(key) {
    //clones configData map so different consumers can have independent configData instances
    this._configDataClonesMap.set(key, _.cloneDeep(this._configData));
  }
  getConfigDataClone(key) {
    //returns independent configData instances if key is passed, else returns the map of configData instances
    this._configDataClonesMap.get(key);
    if (arguments.length == 1) {
      return this._configDataClonesMap.get(key);
    }
    return this._configDataClonesMap;
  }
}

export class QuizzerDataClass extends AppDataClass {
  //Extension of base AppData class to provide functionality specific to quizzer
  constructor() {
    super();
    this._data = new Map();
  }
  updateData(...entries) {
    //add new entries to data map or update existing entry
    entries.forEach((entry) => {
      this._data.set(entry[0], entry[1]);
    });
  }
  updateConfigData = (...entries) => {
    //add new entries to configData object or update existing entry
    entries.forEach((entry) => {
      this._configData[entry[0]] = entry[1];
    });
  };
  getData(key) {
    //gets either whole data storage map or a specific value if key is specified
    if (arguments.length == 1) {
      return super.getData().get(key);
    }
    return super.getData();
  }
  getConfigData(key) {
    //gets either whole configData storage object or a specific value if key is specified
    if (arguments.length == 1) {
      return super.getConfigData()[key];
    }
    return super.getConfigData();
  }
}
