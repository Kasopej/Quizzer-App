import API_ServiceClass from "../../services/api-service.js";
import { LocalDataPersistenceClass } from "../../services/persistent-service.js";
import UiClass from "../ui/ui.js";
import { LOGIN_URL, REGISTER_URL } from "./url.js";

const localDataPersistenceService = new LocalDataPersistenceClass();
export const ui = new UiClass();
export const apiService = new API_ServiceClass();
export default class UserControl {
  constructor() {}
  async login(email, password) {
    const data = {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({ email, password }),
    };
    let result = await apiService.postData(LOGIN_URL, data);
    if ("token" in result)
      return { ...result, timeLoggedIn: new Date().valueOf() };
    else if ("error" in result) return false;
  }
  checkIfUserIsSignedIn() {
    if (localDataPersistenceService.getData("loginStatus")) {
      return true;
    }
    return false;
  }
  async register(email, password) {
    if (this.isEmailAlreadyRegistered(email)) {
      ui.displayAlert("Email is already registered");
      return false;
    }
    const data = {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({ email, password }),
    };
    let result = await apiService.postData(REGISTER_URL, data);
    if ("token" in result)
      return { ...result, timeLoggedIn: new Date().valueOf() };
    else if ("error" in result) return false;
  }
  logout() {}
  async getAndSaveAllUsers(url) {
    if (!localDataPersistenceService.getData("allUserAccounts")) {
      //if data does not exist in localStorage, it initiliazes he field with an empty array
      localDataPersistenceService.saveData("allUserAccounts", []);
    }
    let responseData = await apiService.fetchData(url);
    let arrayOfUserAccounts =
      localDataPersistenceService.getData("allUserAccounts"); //gets user accounts data sacved in localStorage already
    arrayOfUserAccounts.push(...responseData.data); //adds accounts fetched from the database to those gotten from localStorage
    if (responseData.page < responseData.total_pages) {
      localDataPersistenceService.saveData(
        "allUserAccounts",
        arrayOfUserAccounts
      );
      this.getAndSaveAllUsers(url.slice(0, -1) + (responseData.page + 1)); //if endpoint(url) is not the last page, makes a recursive call to fetch and save user data with next page API endpoint (API divides users data into pages)
    }
    localDataPersistenceService.saveData(
      "allUserAccounts",
      arrayOfUserAccounts
    );
  }
  isEmailAlreadyRegistered(email) {
    let arrayOfUserAccounts =
      localDataPersistenceService.getData("allUserAccounts"); //gets user accounts that were saved in local storage
    if (
      arrayOfUserAccounts.find((user) => {
        return user.email === email;
      }) //if array.find finds a matching email, returns true
    ) {
      return true;
    }
    return false;
  }
  getPreferences() {
    return this._preferences;
  }
  updatePreferences(preferences) {
    this._preferences = preferences;
  }
  getProfile() {}
  updateProfile() {}
  accessLevel() {}
}

export class AdminControl extends UserControl {
  isUserAdmin(user) {}
  getToken() {}
  updatePreferences() {}
}
