import API_ServiceClass from "../../services/api-service.js";
import { LocalDataPersistenceClass } from "../../services/persistent-service.js";
import UiClass from "../ui/ui.js";
import { LOGIN_URL, REGISTER_URL } from "../util/url.js";
import User, { Admin } from "./user.js";

const localDataPersistenceService = new LocalDataPersistenceClass();
export const ui = new UiClass();
export const apiService = new API_ServiceClass();
export default class UserControl {
  constructor(user) {
    if (user instanceof User) {
      this.user = user;
    }
  }
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
    if ("token" in result) {
      this.user.token = result.token;
      this.user.timeLastLoggedIn = new Date().valueOf();
      this.user.profile.email = email;
      this.user.isLoggedIn = true;
      localDataPersistenceService.saveData("loggedUser", this.user);
      return this.user;
    } else if ("error" in result) return false;
  }
  attemptAutoLogin() {
    let loggedUser = localDataPersistenceService.getData("loggedUser");
    if (loggedUser) {
      Object.assign(this.user, loggedUser);
      this.user.timeLastLoggedIn = new Date().valueOf();
    }
  }
  async register(email, password) {
    if (this.isEmailAlreadyRegistered(email)) {
      //ui.displayAlert("Email is already registered");
      //return false;
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
    if ("token" in result) {
      this.user.token = result.token;
      return this.user;
    } else if ("error" in result) {
      //this.user.token = result.error;
      return false;
    }
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
  accessLevel() {}
}

export class AdminControl extends UserControl {
  isUserAdmin(admin) {
    if (admin instanceof Admin) {
      if (admin.token) {
        return true;
      }
      return false;
    }
    return false;
  }
}
