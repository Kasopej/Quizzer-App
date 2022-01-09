import TestsLogger from "../../modules/tests-logger/tests-logger.js";
import { AdminControl } from "../../modules/user/user-control.js";
import { Admin } from "../../modules/user/user.js";
describe("Admin is a class that instantiates a admin and has fields to record the status of the admin", function () {
  let admin, adminControl;
  beforeEach(function () {
    admin = new Admin();
    adminControl = new AdminControl(admin);
    spyOn(TestsLogger.prototype, "addNewTest");
  });
  it("can confirm if an admin instance has admin authorization", async function () {
    let entry = ["eve.holt@reqres.in", "cityslicka"];
    await adminControl.register(entry[0], entry[1]);
    expect(adminControl.isUserAdmin(admin)).toBeTrue();
  });
  it("can initiate addition of a new test set to the test database", function () {
    let testSetData = {
      amount: 5,
      categoryName: "Science",
      category: "17",
      difficulty: "easy",
      type: "multiple",
      timing: "UntimedQuiz",
      expiryDate: "1640304000000",
      candidateEmails: ["adam@dev.com"],
      testGroupId: "14596033566555",
      adminToken: "QpwL5tke4Pnpja7X4",
    };
    admin.createTest(testSetData);
    expect(TestsLogger.prototype.addNewTest).toHaveBeenCalled();
  });
  it("can initiate update of  an exisitng test set", function () {
    spyOn(TestsLogger.prototype, "editExistingTest");
    admin.updateTest();
    expect(TestsLogger.prototype.editExistingTest).toHaveBeenCalled();
  });
  it("can initiate delete of a test set", function () {
    spyOn(TestsLogger.prototype, "deleteTest");
    admin.deleteTest();
    expect(TestsLogger.prototype.deleteTest).toHaveBeenCalled();
  });
});
