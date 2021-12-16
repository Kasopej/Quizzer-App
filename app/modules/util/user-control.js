import API_ServiceClass from "../../services/api-service.js";
import { LocalDataPersistenceClass } from "../../services/persistent-service.js";
import { LOGIN_URL } from "./url.js";

const apiService = new API_ServiceClass();
const localDataPersistenceService = new LocalDataPersistenceClass();
export default class UserControl {
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
  logout() {}
}
