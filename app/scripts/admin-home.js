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

let actionsSelectElement, actionOptionElement;
adminControl.attemptAutoLogin();
if (!(admin.isLoggedIn && adminControl.isUserAdmin(admin))) {
  router.redirect();
}
ui.removeElement(ui.getElements(".page-blocker")[0]);
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
  testSetElement.classList.add("set" + (index + 1));
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
      }</td><td><select name="admin-action" class="admin-action custom-select w-75"><option selected>Select Action</option><option value="view">View Result</option><option value="modify">Modify</option><option value="delete">Delete</option></select><button class="btn btn-danger do-action" id="${
        index + 1
      }">Go</button></td>`,
    ]
  );
});
if (testsLogArray.length) {
  ui.replaceChildren(testsLogTableBodyElement, testSetElementsArray);
  ui.addEventListenerToElements(
    ui.getElements(".do-action"),
    ["click"],
    [executeSelectedAction]
  );
}

async function executeSelectedAction() {
  const selectedActionElement = ui.getElementsFromNode(
    ui.getElements(`tr.set${this.id}`)[0],
    "option"
  )[
    ui.getElementsFromNode(ui.getElements(`tr.set${this.id}`)[0], "select")[0]
      .selectedIndex
  ];
  let selectedAction = ui.getInputValue([selectedActionElement])[0];
  switch (selectedAction) {
    case "view":
      router.goToRoute("quiz-results.html");
      break;
    case "modify":
      router.goToRoute(`quiz-setup.html?mode=edit&id=${this.id}`);
      break;
    case "delete":
      await admin.deleteTest(this.id);
      router.goToRoute("admin-home.html");
      break;
    default:
      break;
  }
}
