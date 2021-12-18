import { HandlerHelpersClass } from "../../Modules/util/helpers.js";
import UserControl from "../../Modules/util/user-control.js";
import { apiService } from "../../Modules/util/user-control.js";
describe("Register is a function that registers new admins with the following conditions", function () {
  let resultsArray, userControl, handlerHelpers;
  beforeEach(function () {
    resultsArray = [];
    userControl = new UserControl();
    handlerHelpers = new HandlerHelpersClass();
    spyOn(apiService, "postData").and.callThrough();
  });
  it("it does not register the admins if the provided email & password does not fit the set format(s), or if they are not provided", async function () {
    /*
    Email must be valid email format
    Password must contain at least one uppercase letter and at least one number, and be 10 characters long
    */
    let entries = [
      ["eve.holt.in", "cityslicka"],
      ["michael.lawson@reqres.in", "yhdddhR%o"],
      ["lindsay.ferguson@reqres.in", "gHshhd"],
      ["", "1yfffhR%o"],
      ["samuel.lanxin@reqres.in", ""],
    ];
    for (const entry of entries) {
      if (
        handlerHelpers.validateEmails([entry[0]]) &&
        handlerHelpers.validatePassword(entry[1])
      ) {
        let loginResult = await userControl.register(entry[0], entry[1]);
        if (loginResult) resultsArray.push(loginResult);
      }
    }
    expect(apiService.postData).not.toHaveBeenCalled();
  });
  xit("it does not register the admin if the provided email already exists", async function () {
    let entries = [
      ["eve.hot@reqres.in", "cityslicka"],
      [undefined, ""],
      [null, "cityslicka"],
      [NaN, "cityslicka"],
      ["eve.holt@reqres.in", ""],
      ["eve.holt@reqres.in", null],
      ["eve.holt@reqres.in", undefined],
      [undefined, undefined],
    ];
    for (const entry of entries) {
      let loginResult = await new UserControl().login(entry[0], entry[1]);
      if (loginResult) resultsArray.push(loginResult);
    }
    expect(resultsArray).toHaveSize(0);
  });
  xit("throws an error if request could not be completed", async function () {
    let entries = [
      ["eve.holt@reqres.in", "cityslicka"],
      ["eve.holt@reqres.in", undefined],
      [undefined, "cityslicka"],
    ];
    await expectAsync(
      new UserControl().login(entries[0], entries[1])
    ).not.toBeRejected();
  });
});
