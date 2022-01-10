import User, { Admin } from "../modules/user/user.js";
import { AdminControl } from "../modules/user/user-control.js";
import RouterService from "../services/router.js";
import UiClass from "../modules/ui/ui.js";

//Instantiate business logic classes
const admin = new Admin();
const adminControl = new AdminControl(admin);
const router = new RouterService();
const ui = new UiClass();

adminControl.attemptAutoLogin();
if (!(admin.isLoggedIn && adminControl.isUserAdmin(admin))) {
  router.redirect();
}
ui.removeElement(ui.getElements(".page-blocker")[0]);
console.log(JSON.stringify(admin));

/*
'<td></td><td></td><td></td><td>Education</td><td><select name="cars" class="custom-select w-75"><option selected>Select Action</option><option value="view">View Result</option><option value="modify">Modify</option><option value="delete">Delete</option></select><button class="btn btn-danger">Go</button></td>';
*/