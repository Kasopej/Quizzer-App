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
  getProfile() {}
  updateProfile() {}
}
