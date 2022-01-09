import UserControl, { AdminControl } from "../../modules/user/user-control.js";
import User from "../../modules/user/user.js";
describe("User is a class that instantiates a user and has fields to record the status of the user", function () {
  let user, adminControl;
  beforeEach(function () {
    user = new User();
    adminControl = new AdminControl(user);
  });
  it("can comfirm if the user is logged in", async function () {
    let entry = ["eve.holt@reqres.in", "cityslicka"];
    await adminControl.login(entry[0], entry[1]);
    expect(user.isLoggedIn).toBeTrue();
  });
});
