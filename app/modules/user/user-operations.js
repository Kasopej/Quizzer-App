export default class UserOperations {
  getPreferences() {
    return this._preferences;
  }
  updatePreferences(preferences) {
    this._preferences = preferences;
  }
  getProfile() {}
  updateProfile() {}
}
export class AdminOperations extends UserOperations {}
