import User from "../../modules/util/user.js";
import { LocalDataPersistenceClass } from "../../services/persistent-service.js";
describe("Login is a method that logs in admins, with the following conditions:", function () {
  let resultsArray, user;
  beforeEach(function () {
    resultsArray = [];
    user = new User();
    spyOn(user, "login").and.callThrough();
  });
  it("return an object with a token field when correct login credentials are passed", async function () {
    let entries = [
      ["eve.holt@reqres.in", "cityslicka"],
      ["michael.lawson@reqres.in", "yhhdhdjk"],
      ["lindsay.ferguson@reqres.in", "ghshdhd"],
    ];
    for (const entry of entries) {
      let loginResult = await user.login(entry[0], entry[1]);
      if (loginResult) resultsArray.push(loginResult);
    }
    expect(resultsArray).toHaveSize(entries.length);
  });
  it("returns false if there are incorrect or missing credentials (the email is undefined or does not exist in database or if password is empty)", async function () {
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
      let loginResult = await user.login(entry[0], entry[1]); //should return false
      if (loginResult) resultsArray.push(loginResult);
    }
    expect(resultsArray).toHaveSize(0);
  });
  it("throws an error if request could not be completed (Failed connection)", async function () {
    let entries = [
      ["eve.holt@reqres.in", "cityslicka"],
      ["eve.holt@reqres.in", undefined],
      [undefined, "cityslicka"],
    ];
    await expectAsync(user.login(entries[0], entries[1])).toBeRejected();
  });
  it("keeps the user logged in even with refresh", async function () {
    //This test may fail the first time it is ran i.e if no user is currently logged in
    const localDataPersistenceService = new LocalDataPersistenceClass();
    if (!user.checkIfUserIsSignedIn()) {
      localDataPersistenceService.saveData("loginStatus", {
        "eve.holt@reqres.in": await user.login(
          "eve.holt@reqres.in",
          "cityslicka"
        ),
      });
    }
    expect(user.login).not.toHaveBeenCalled();
  });
});
