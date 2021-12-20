import API_ServiceClass from "../../services/api-service.js";
import { LocalDataPersistenceClass } from "../../services/persistent-service.js";
import { LOGIN_URL, REGISTER_URL, LIST_USERS_URL } from "./url.js";

export const apiService = new API_ServiceClass();
const localDataPersistenceService = new LocalDataPersistenceClass();
export default class UserControl {
  constructor() {
    this.apiService = new API_ServiceClass();
  }
  async login(email, password) {
    const data = {
      method: "POST",
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
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
    const data = {
      method: "POST",
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
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
      localDataPersistenceService.saveData("allUserAccounts", []);
    }
    let responseData = await this.apiService.fetchData(url);
    let arrayOfUserAccounts =
      localDataPersistenceService.getData("allUserAccounts");
    arrayOfUserAccounts.push(...responseData.data);
    if (responseData.page < responseData.total_pages) {
      localDataPersistenceService.saveData(
        "allUserAccounts",
        arrayOfUserAccounts
      );
      this.getAndSaveAllUsers(url.slice(0, -1) + (responseData.page + 1));
    }
    localDataPersistenceService.saveData(
      "allUserAccounts",
      arrayOfUserAccounts
    );
  }
  isEmailAlreadyRegistered(email) {
    let arrayOfUserAccounts =
      localDataPersistenceService.getData("allUserAccounts");
    if (
      arrayOfUserAccounts.find((user) => {
        return user.email === email;
      })
    ) {
      return true;
    }
    return false;
  }
}
