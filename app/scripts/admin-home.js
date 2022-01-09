import User from "../modules/user/user.js";
import { AdminControl } from "../modules/user/user-control.js";
import RouterService from "../services/router.js";
import UiClass from "../modules/ui/ui.js";

//Instantiate business logic classes
const user = new User();
const adminControl = new AdminControl(user);
const router = new RouterService();
const ui = new UiClass();

adminControl.attemptAutoLogin();
if (!(user.isLoggedIn && adminControl.isUserAdmin(user))) {
  router.redirect();
}
ui.removeElement(ui.getElements(".page-blocker")[0]);
console.log(JSON.stringify(user));
