import API_ServiceClass from "../../services/api-service.js";
import { LOGIN_URL } from "./url.js";

const apiService = new API_ServiceClass();
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
    return await apiService.postData(LOGIN_URL, data);
  }
  logout() {}
}
