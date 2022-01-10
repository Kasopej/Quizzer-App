import { QuizzerDataClass } from "../Modules/app-data/app-data.js";
import { QuizzerDataOperationsClass } from "../Modules/app-data/app-data-operations.js";
import UiClass from "../Modules/ui/ui.js";
import {
  InputValidationHelpersClass,
  UrlHelperClass,
} from "../Modules/util/helpers.js";
import { CATEGORIES_URL, QUIZ_PAGE_PATH } from "../Modules/util/url.js";
import ApiServiceClass from "../services/api-service.js";
import { ClipboardClass } from "../services/user-agent.js";
import { Admin } from "../modules/user/user.js";
import { AdminControl } from "../modules/user/user-control.js";

// Instantiate business logic classes
const admin = new Admin();
const adminControl = new AdminControl(admin);
const ui = new UiClass();
const apiService = new ApiServiceClass();
const quizzerData = new QuizzerDataClass();
const quizzerDataOperation = new QuizzerDataOperationsClass(quizzerData);
const inputValidationHelpers = new InputValidationHelpersClass();
const URL_Helper = new UrlHelperClass();
const clipBoardObj = new ClipboardClass();

// Import node objects from DOM
const questionQtyInputElement = ui.getElements("#amountOfQuestions")[0];
const categorySelectElement = ui.getElements("#categorySelect")[0];
const difficultySelectElement = ui.getElements("#difficultySelect")[0];
const typeSelectElement = ui.getElements("#typeSelect")[0];
const timingSelectElement = ui.getElements("#timingSelect")[0];
const difficultyOptionElements = Array.from(
  ui.getElements("#difficultySelect option")
);
const typeOptionElements = Array.from(ui.getElements("#typeSelect option"));
const timingOptionElements = Array.from(ui.getElements("#timingSelect option"));
const submitButtonElement = ui.getElements("#submitBtn")[0];
const testExpirationDateElement = ui.getElements("#expiryDate")[0];
const modalBodyElement = ui.getElements("#quiz-link-modal p")[0];
const emailTextAreaElement = ui.getElements("#candidatesEmails")[0];

adminControl.attemptAutoLogin();
if (!(admin.isLoggedIn && adminControl.isUserAdmin(admin))) {
  router.redirect();
}
//Make call for categories and attach them to category form element
quizzerData.updateData([
  "Quiz Categories",
  await apiService
    .fetchData(CATEGORIES_URL)
    .then((data) => data.trivia_categories),
]);
quizzerData.getData("Quiz Categories").forEach((categoryObj) => {
  const optionElement = ui.createElements("option");
  ui.setAttributes([optionElement], ["value"], [categoryObj.id]);
  ui.attachText([optionElement], [categoryObj.name]);
  ui.attachElements(categorySelectElement, optionElement);
});
const categoryOptionElements = Array.from(
  ui.getElements("#categorySelect option")
);

//Check that categories data is saved/available in app (quizzer) data
if (
  quizzerDataOperation.isDataAvailable(
    quizzerData,
    "getData",
    "Quiz Categories"
  )
) {
  ui.removeElement(ui.getElements(".category-options-spinner")[0]);
}

function checkAndValidateQuantityInput() {
  /*Checks number of questions available, based on current form selection. Prevents submission while checking 
  Then validates quantity selected by user to ensure it is not more than available quantity
  */
  let selectedCategory =
    categoryOptionElements[categorySelectElement.selectedIndex].value;
  let selectedDifficulty =
    difficultyOptionElements[difficultySelectElement.selectedIndex].value;
  ui.setAttributes([submitButtonElement], ["disabled"], [""]);
  quizzerDataOperation
    .getQtyOfQuestionsAvailable(selectedCategory, selectedDifficulty)
    .then(() => {
      let quantity = quizzerData.getData("questionsCountInSelection");
      ui.attachText(
        [ui.getElements(".questionQuantityGroup .valid-feedback")[0]],
        [`Number of questions available: ${quantity}`]
      );
      validateQuantityInput();
      ui.removeAttributes([submitButtonElement], ["disabled"]);
    });
}
function validateQuantityInput() {
  //Prevent user from exceeding limits for available number of questions
  inputValidationHelpers.limitNumericalEntry.call(
    questionQtyInputElement,
    [quizzerData.getData("questionsCountInSelection"), 1],
    ["max", "min"]
  );
}

function save_UI_Config_Entries(event) {
  //On form submit action, save form selections to configData
  const selectedCategoryOptionElement =
    categoryOptionElements[categorySelectElement.selectedIndex];
  const selectedDifficultyOptionElement =
    difficultyOptionElements[difficultySelectElement.selectedIndex];
  const selectedTypeOptionElement =
    typeOptionElements[typeSelectElement.selectedIndex];
  const selectedTimingOptionElement =
    timingOptionElements[timingSelectElement.selectedIndex];
  let [candidatesEmails, numberOfQuestions] = ui.getInputValue([
    emailTextAreaElement,
    questionQtyInputElement,
  ]);
  //save actions
  quizzerData.updateConfigData(
    ["amount", numberOfQuestions],
    ["categoryName", selectedCategoryOptionElement.innerText],
    ["category", selectedCategoryOptionElement.value],
    ["difficulty", selectedDifficultyOptionElement.value],
    ["type", selectedTypeOptionElement.value],
    ["timing", selectedTimingOptionElement.value]
  );
  if (
    testExpirationDateElement.valueAsNumber >= new Date().valueOf() ||
    testExpirationDateElement.valueAsNumber !==
      testExpirationDateElement.valueAsNumber
  ) {
    quizzerData.updateConfigData([
      "expiryDate",
      testExpirationDateElement.valueAsNumber,
    ]);
  } else {
    alert("Please speciify a future date for test expiration");
    ui.replaceHTML([modalBodyElement], [""]);
    return;
  }
  //Emails entry requires processing before save
  processEmailEntries(candidatesEmails);
  event.preventDefault();
}

async function processEmailEntries(candidatesEmails) {
  //Validate emails and print links (if emails valid). Generate unique configuration link for each email
  ui.replaceHTML([modalBodyElement], [""]);

  candidatesEmails = candidatesEmails.trim();
  const candidatesEmailsArray = candidatesEmails.split(",");
  //If email(s) all successfully validated, create links for them. Link elements when clicked should call function to copy unique configuration link to clipboard.
  if (
    candidatesEmails &&
    inputValidationHelpers.validateEmails(candidatesEmailsArray)
  ) {
    quizzerData.updateConfigData(
      ["candidateEmails", candidatesEmailsArray],
      ["adminToken", admin.token],
      ["timeStamp", new Date().valueOf()]
    );
    await admin.createTest(quizzerData.getConfigData());
    let index = 0;
    for (let candidateEmail of candidatesEmailsArray) {
      candidateEmail = candidateEmail.trim();
      quizzerData.updateConfigData(["candidateEmail", candidateEmail]);
      //ui.attachText([modalBodyElement], [location.origin + '/quiz?' + URL_Helper.generateTokenLink(URL_Helper.generateQuery(Array.from(quizzerData.getConfigData().entries())))]);
      let candidateEmailAnchorElement = ui.createElements("a");
      ui.setAttributes(
        [candidateEmailAnchorElement],
        ["href", "id"],
        ["#", index]
      );
      quizzerData.mapConfigDataClone(index); //map clone of unique configuration data (for current email) by index
      ui.addEventListenerToElements(
        [candidateEmailAnchorElement],
        ["click"],
        [
          function (e) {
            clipBoardObj.write(
              location.origin +
                QUIZ_PAGE_PATH +
                URL_Helper.generateQuery(
                  Array.from(
                    Object.entries(quizzerData.getConfigDataClone(+this.id))
                  ),
                  true
                )
            );
          },
        ]
      );

      /*
                ui.addEventListenerToElements([candidateEmailAnchorElement], ['click'], [function () { clipBoardObj.write(location.origin + QUIZ_PAGE_PATH + URL_Helper.generateTokenLink(URL_Helper.generateQuery(Array.from(Object.entries(quizzerData.getConfigData())), true))) }
                ]);
                */
      index++;
      ui.attachText(
        [candidateEmailAnchorElement],
        [`Click to copy link for Candidate (${candidateEmail})`]
      );
      ui.attachElements(modalBodyElement, candidateEmailAnchorElement);
    }

    ui.removeClassFromElements(
      [ui.getElements("#candidatesEmails")[0]],
      "is-invalid"
    );
    return;
  }
  //If email(s) not successfully validated, attach error text & css class
  ui.attachText(
    [modalBodyElement],
    ["Invalid entry, please enter one or more comma separated email addresses"]
  );
  ui.addClassToElements([ui.getElements("#candidatesEmails")[0]], "is-invalid");
}

ui.addEventListenerToElements(
  [
    submitButtonElement,
    questionQtyInputElement,
    categorySelectElement,
    difficultySelectElement,
    emailTextAreaElement,
  ],
  ["click", "input", "change", "change", "change"],
  [
    save_UI_Config_Entries,
    validateQuantityInput,
    checkAndValidateQuantityInput,
    checkAndValidateQuantityInput,
    function () {
      inputValidationHelpers.preventSuccessiveSameCharacterEntry.call(
        this,
        "."
      );
      inputValidationHelpers.preventSuccessiveSameCharacterEntry.call(
        this,
        ","
      );
      inputValidationHelpers.preventSuccessiveSameCharacterEntry.call(
        this,
        "@"
      );
    },
  ]
);
checkAndValidateQuantityInput();
