import { userControl } from "../App/scripts/index.js";

describe("Login", function () {
  it("return an object with a token when login is successful", async function () {
    let dataArray = [];
    let entries = [["eve.holt@reqres.in", "cityslicka"]];
    for (const entry of entries) {
      let data = await userControl.login(entry[0], entry[1]);
      dataArray.push(data);
    }
    expect(dataArray).toHaveSize(1);
  });
});
