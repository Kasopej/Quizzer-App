import { AdminControl } from "../../modules/user/user-control.js";
import { Admin } from "../../modules/user/user.js";
describe("Admin is a class that instantiates a admin and has fields to record the status of the admin", function () {
  let admin, adminControl;
  beforeEach(function () {
    admin = new Admin();
    adminControl = new AdminControl(admin);
  });
  it("can confirm if an admin instance has admin authorization", async function () {
    let entry = ["eve.holt@reqres.in", "cityslicka"];
    await adminControl.register(entry[0], entry[1]);
    expect(adminControl.isUserAdmin(admin)).toBeTrue();
  });
});
