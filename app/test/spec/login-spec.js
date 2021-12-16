import UserControl from "../../Modules/util/user-control.js";
describe("Login", function () {
  it("return an object with a token when correct login credentials are passed", async function () {
    let dataArray = [];
    let entries = [
      ["eve.holt@reqres.in", "cityslicka"],
      ["michael.lawson@reqres.in", "yhdhdhdjk"],
      ["lindsay.ferguson@reqres.in", "ghshdhd"],
    ];
    for (const entry of entries) {
      let loginResult = await new UserControl().login(entry[0], entry[1]);
      if (loginResult) dataArray.push(loginResult);
    }
    expect(dataArray).toHaveSize(entries.length);
  });
  it("returns an object with an error if incorrect or missing credentials (the email is undefined or does not exist in database or if password is missing)", async function () {
    let dataArray = [];
    let entries = [
      ["eve.holt@reqres.", "cityslicka"],
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
      if (loginResult) dataArray.push(loginResult);
    }
    expect(dataArray).toHaveSize(0);
  });
  it("throws an error if request could not be completed", async function () {
    let entries = ["eve.holt@reqres.in", "cityslicka"];
    await expectAsync(
      new UserControl().login(entries[0], entries[1])
    ).not.toBeRejected();
  });
});
