import UserControl from "../../modules/user/user-control.js";
descibe(
  "User is a class that instantiates a user and provides behaviours such as login & access control",
  function () {
    const userControl = new UserControl();
    it("can comfirm if the user is logged in", function () {
      let entry = ["eve.holt@reqres.in", "cityslicka"];
      userControl.login(entry[0], entry[1]);
    });
  }
);
