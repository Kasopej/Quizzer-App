import { userControl } from "../../scripts/index.js";
describe("Login", function () {
  it("return an object with a token when login is successful", async function () {
    let dataArray = [];
    let entries = [["eve.holt@reqres.in", "cityslicka"]];
    for (const entry of entries) {
      let data = await userControl.login(entry[0], entry[1]);
      try {
        if ("token" in data) dataArray.push(data);
      } catch (e) {
        console.log(e);
      }
    }
    expect(dataArray).toHaveSize(entries.length);
  });
  it("returns an object with an error if the email is undefined or does not exist in database", async function () {
    let dataArray = [];
    let entries = [["eve.holt@reqres.", "cityslicka"]];
    for (const entry of entries) {
      let data = await userControl.login(entry[0], entry[1]);
      if ("error" in data) dataArray.push(data);
    }
    expect(dataArray).toHaveSize(entries.length);
  });
});
