import User, { Admin } from "../modules/user/user.js";
import { AdminControl } from "../modules/user/user-control.js";
import RouterService from "../services/router.js";
import UiClass from "../modules/ui/ui.js";
import TestsLogger from "../modules/tests-logger/tests-logger.js";

//Instantiate business logic classes
const admin = new Admin();
const adminControl = new AdminControl(admin);
const router = new RouterService();
const ui = new UiClass();
const testsLogger = new TestsLogger();

//import DOM objects
const testsLogTableBodyElement = ui.getElements("table.tests-logs tbody")[0];

adminControl.attemptAutoLogin();
if (!(admin.isLoggedIn && adminControl.isUserAdmin(admin))) {
  router.redirect();
}
ui.removeElement(ui.getElements(".page-blocker")[0]);
console.log(JSON.stringify(admin));
ui.replaceChildren(testsLogTableBodyElement);

const testsLogArray = await testsLogger.getTests();
let testSetElementsArray = ui.createElements(
  ..."tr "
    .repeat(testsLogArray.length)
    .split(" ")
    .slice(0, testsLogArray.length)
);
if (!Array.isArray(testSetElementsArray)) {
  testSetElementsArray = [testSetElementsArray];
}
testSetElementsArray.forEach((testSetElement, index) => {
  let testSet = testsLogArray[index];
  let testSetExpiryDate = testSet.expiryDate;
  let testStatus =
    testSetExpiryDate === null || testSetExpiryDate > new Date().valueOf()
      ? "active"
      : "expired";
  ui.attachHTML(
    [testSetElement],
    [
      `<td>${new Date(
        testSet.timeStamp
      ).toDateString()}</td><td>${testStatus}</td><td>${
        testSet.candidateEmails.length
      }</td><td>${
        testSet.categoryName
      }</td><td><select name="action" class="custom-select w-75"><option selected>Select Action</option><option value="view">View Result</option><option value="modify">Modify</option><option value="delete">Delete</option></select><button class="btn btn-danger do-action">Go</button></td>`,
    ]
  );
});

ui.replaceChildren(testsLogTableBodyElement, testSetElementsArray);
