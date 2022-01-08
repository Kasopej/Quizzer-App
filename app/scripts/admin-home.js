import User from "../modules/user/user.js";
import { AdminControl } from "../modules/user/user-control.js";
import RouterService from "../services/router.js";

//Instantiate business logic classes
const user = new User();
const adminControl = new AdminControl(user);
const router = new RouterService();

adminControl.attemptAutoLogin();
if (!(user.isLoggedIn && adminControl.isUserAdmin(user))) {
  router.redirect();
}
