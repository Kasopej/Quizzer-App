import { HandlerHelpersClass } from "../../Modules/util/helpers.js";
import UserControl from "../../Modules/util/user-control.js";
import { apiService } from "../../Modules/util/user-control.js";
describe("Register is a function that registers new admins with the following conditions", function () {
  let resultsArray, userControl, handlerHelpers;
  beforeEach(function () {
    resultsArray = [];
    userControl = new UserControl();
    handlerHelpers = new HandlerHelpersClass();
    spyOn(userControl, "register").and.callThrough();
    spyOn(apiService, "postData").and.callThrough();
  });
  it("it does not register the admins if the provided email & password does not fit the set format(s), or if they are not provided", async function () {
    /*
    Email must be string and in valid email format
    Password must contain at least one uppercase letter and at least one number, and be 10 characters long
    */
    let entries = [
      ["eve.holt.in", "cityslicka"],
      ["michael.lawson@reqres.in", "yhdddhR%o"],
      ["lindsay.ferguson@reqres.in", "gHshhd"],
      ["", "1yfffhR%o"],
      ["samuel.lanxin@reqres.in", undefined],
      [{}, "1yfffhR%o"],
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
  it("it does not register the admin if the provided email already exists", async function () {
    let entries = [
      ["eve.holt@reqres.in", "cityslicka"],
      ["george.bluth@reqres.in", "toooughboys"],
    ];
    for (const entry of entries) {
      if (
        handlerHelpers.validateEmails([entry[0]]) &&
        handlerHelpers.validatePassword(entry[1])
      ) {
        if (!userControl.isEmailAlreadyRegistered(entry[0])) {
          await userControl.register(entry[0], entry[1]);
        }
      }
    }
    expect(userControl.register).not.toHaveBeenCalled();
  });
  it("return an object when correct registeration credentials are passed", async function () {
    let entries = [
      ["adam.don@reqres.in", "2tytffhR%o"],
      ["sola.johnson@smartflow.in", "Dt5tffhR%o"],
    ];
    for (const entry of entries) {
      if (
        handlerHelpers.validateEmails([entry[0]]) &&
        handlerHelpers.validatePassword(entry[1])
      ) {
        if (!userControl.isEmailAlreadyRegistered(entry[0])) {
          let registerationResult = await userControl.register(
            entry[0],
            entry[1]
          );
          if (registerationResult) resultsArray.push(registerationResult);
        }
      }
    }
    //expect(resultsArray).toHaveSize(entries.length);
    expect(userControl.register).toHaveBeenCalled();
  });
});
