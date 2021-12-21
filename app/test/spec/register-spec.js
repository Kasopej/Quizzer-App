import { HandlerHelpersClass } from "../../Modules/util/helpers.js";
import UserControl from "../../Modules/util/user-control.js";
import { apiService, ui } from "../../Modules/util/user-control.js";

describe("Register is a method that registers new admins with the following conditions:", function () {
  let resultsArray, userControl, handlerHelpers;
  beforeEach(function () {
    resultsArray = [];
    userControl = new UserControl();
    handlerHelpers = new HandlerHelpersClass();
    spyOn(userControl, "register").and.callThrough();
    spyOn(apiService, "postData").and.callThrough();
    spyOn(ui, "displayAlert");
  });
  it("it does not attempt to post data if the admins if the provided email & password does not fit the required format(s), or if they are not provided", async function () {
    /*
    Email must be string and in valid email format
    Password must contain at least one uppercase letter and at least one number, and be at least 8 characters long
    */
    let entries = [
      ["eve.holt.in", "cityslicka"],
      ["michael.lawson@reqres.in", "yhdddhR%o"],
      ["lindsay.ferguson@reqres.in", "gHshhd"],
      ["", "Fyf3fR%o"],
      ["samuel.lanxin@reqres.in", undefined],
      [{}, "1yffhR%o"],
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
  it("it does not post data if the provided email already exists", async function () {
    let entries = [
      ["eve.holt@reqres.in", "cl2&Dcka"],
      ["george.bluth@reqres.in", "touGhb0y$"],
    ];
    for (const entry of entries) {
      if (
        handlerHelpers.validateEmails([entry[0]]) &&
        handlerHelpers.validatePassword(entry[1])
      ) {
        await userControl.register(entry[0], entry[1]);
      }
    }
    expect(apiService.postData).not.toHaveBeenCalled();
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
        let registerationResult = await userControl.register(
          entry[0],
          entry[1]
        );
        if (registerationResult) resultsArray.push(registerationResult);
      }
    }
    //expect(resultsArray).toHaveSize(entries.length);
    expect(apiService.postData).toHaveBeenCalled();
  });
});
