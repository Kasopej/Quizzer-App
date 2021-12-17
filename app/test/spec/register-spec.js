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
  it("it does not register the admins if the provided data does not fit the set format(s)", async function () {
    /*
    Email must be valid email format
    Password must contain at least one uppercase letter and at least one number, and be 10 characters long
    */
    let entries = [
      ["eve.holt.in", "cityslicka"],
      ["michael.lawson@reqres.in", "1yhhdR%ghto"],
      ["lindsay.ferguson@reqres.in", "gHshhd"],
    ];
    for (const entry of entries) {
      if (
        handlerHelpers.validateEmails([entry[0]]) &&
        handlerHelpers.validatePassword(entry[0])
      ) {
        let loginResult = await userControl.register(entry[0], entry[1]);
        if (loginResult) resultsArray.push(loginResult);
      }
    }
    expect(apiService.postData).not.toHaveBeenCalled();
  });
  xit("returns an object with an error field if incorrect or missing credentials (the email is undefined or does not exist in database or if password is missing)", async function () {
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
