import { LocalDataPersistenceClass } from "../../services/persistent-service.js";
import TestsLogger from "../tests-logger/tests-logger.js";

const localDataPersistenceService = new LocalDataPersistenceClass();
const testsLogger = new TestsLogger();
export default class User {
  constructor() {
    this.isLoggedIn = false;
    this.profile = {};
    this._preferences = {};
  }
  getPreferences() {
    return this._preferences;
  }
  updatePreferences(...entries) {
    entries.forEach((entry) => {
      this._preferences[entry[0]] = entry[1];
    });
    console.log(JSON.stringify(this));
    localDataPersistenceService.saveData("loggedUser", this);
  }
  updateProfile() {}
}

export class Admin extends User {
  constructor() {
    super();
  }
  async createTest(testSetData) {
    await testsLogger.addNewTest(testSetData);
  }
  async updateTest(testSetData, resourceId) {
    await testsLogger.editExistingTest(testSetData, resourceId);
  }
  async deleteTest(resourceId) {
    await testsLogger.deleteTest(resourceId);
  }
  viewResults() {}
}
