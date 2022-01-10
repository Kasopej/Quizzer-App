import User, { Admin } from "../modules/user/user.js";
import { AdminControl } from "../modules/user/user-control.js";
import RouterService from "../services/router.js";
import UiClass from "../modules/ui/ui.js";
import TestsLogger from "../modules/tests-logger/tests-logger.js";
import API_ServiceClass from "../services/api-service.js";
import { CATEGORIES_URL } from "../modules/util/url.js";

//Instantiate business logic classes
const admin = new Admin();
const adminControl = new AdminControl(admin);
const router = new RouterService();
const ui = new UiClass();
const testsLogger = new TestsLogger();
const apiService = new API_ServiceClass();

//import DOM objects
const testsLogTableBodyElement = ui.getElements("table.tests-logs tbody")[0];
const categorySelectElement = ui.getElements("#categorySelect")[0];
const difficultySelectElement = ui.getElements("#difficultySelect")[0];
const difficultyOptionElements = Array.from(
  ui.getElements("#difficultySelect option")
);
const questionQtyInputElement = ui.getElements("#amountOfQuestions")[0];
const preferredDifficultyDisplaElement = ui.getElements(
  ".difficulty-preference"
)[0];
const preferredCategoryDisplaElement = ui.getElements(
  ".category-preference"
)[0];
const preferredAmountDisplaElement = ui.getElements(".amount-preference")[0];
const deleteModal = ui.getElements(".deleteModal")[0];
const cancelBtn = ui.getElements(".cancel-action")[0];
const confirmBtn = ui.getElements(".confirm-action")[0];

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

//Make call for categories and attach them to category form element
const categories = await apiService
  .fetchData(CATEGORIES_URL)
  .then((data) => data.trivia_categories);
categories.forEach((categoryObj) => {
  const optionElement = ui.createElements("option");
  ui.setAttributes([optionElement], ["value"], [categoryObj.id]);
  ui.attachText([optionElement], [categoryObj.name]);
  ui.attachElements(categorySelectElement, optionElement);
});
const categoryOptionElements = Array.from(
  ui.getElements("#categorySelect option")
);
ui.removeElement(ui.getElements(".category-options-spinner")[0]);
ui.addEventListenerToElements(
  [ui.getElements(".update-preferences-btn")[0], cancelBtn, confirmBtn],
  ["click", "click", "click"],
  [savePreferences, cancelDeleteTestAction, confirmDeleteTestAction]
);

//Display admin preferences
function displayUpdatedPreferences() {
  const adminPreferences = Object.assign({}, admin.getPreferences());
  if (Object.keys(adminPreferences).length) {
    preferredCategoryDisplaElement.value = adminPreferences.categoryName;
    preferredAmountDisplaElement.value = adminPreferences.amount;
    preferredDifficultyDisplaElement.value = adminPreferences.difficulty;
    categorySelectElement.value = adminPreferences.category;
    questionQtyInputElement.value = +adminPreferences.amount;
    difficultySelectElement.value = adminPreferences.difficulty;
  }
}
displayUpdatedPreferences();

function savePreferences() {
  const selectedCategoryOptionElement =
    categoryOptionElements[categorySelectElement.selectedIndex];
  const selectedDifficultyOptionElement =
    difficultyOptionElements[difficultySelectElement.selectedIndex];

  let [numberOfQuestions] = ui.getInputValue([questionQtyInputElement]);
  admin.updatePreferences(
    ["amount", numberOfQuestions],
    ["categoryName", selectedCategoryOptionElement.innerText],
    ["category", selectedCategoryOptionElement.value],
    ["difficulty", selectedDifficultyOptionElement.value]
  );
  displayUpdatedPreferences();
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
      ui.removeClassFromElements([deleteModal], "display-none");
      confirmBtn.id = this.id;
      /*
      await admin.deleteTest(this.id);
      router.goToRoute("admin-home.html"); */
      break;
    default:
      break;
  }
}

function cancelDeleteTestAction() {
  ui.addClassToElements([deleteModal], "display-none");
}
async function confirmDeleteTestAction() {
  ui.addClassToElements([deleteModal], "display-none");
  await admin.deleteTest(this.id);
  router.goToRoute("admin-home.html");
}
