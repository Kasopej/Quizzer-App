import TestsLogger from "../tests-logger/tests-logger.js";

const testsLogger = new TestsLogger();
export default class User {
  constructor() {
    this.isLoggedIn = false;
    this.profile = {};
  }
  getPreferences() {
    return this._preferences;
  }
  updatePreferences(preferences) {
    this._preferences = preferences;
  }
  updateProfile() {}
}

export class Admin extends User {
  constructor() {
    super();
  }
  createTest() {
    testsLogger.addNewTest();
  }
  updateTest() {}
  deleteTest() {}
  viewResults() {}
}
