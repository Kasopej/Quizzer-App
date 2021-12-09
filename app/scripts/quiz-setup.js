import { QuizzerDataClass } from "../Modules/app-data/app-data.js";
import { QuizzerDataOperationsClass } from "../Modules/app-data/app-data-operations.js";
import UiClass from "../Modules/ui/ui.js";
import {
  HandlerHelpersClass,
  UrlHelperClass,
} from "../Modules/util/helpers.js";
import { CATEGORIES_URL, QUIZ_PAGE_PATH } from "../Modules/util/url.js";
import ApiServiceClass from "../services/api-service.js";
import { ClipboardClass } from "../services/user-agent.js";

// Instantiate business logic classes
const ui = new UiClass();
const apiService = new ApiServiceClass();
const quizzerData = new QuizzerDataClass();
const quizzerDataOperation = new QuizzerDataOperationsClass(quizzerData);
const handlerHelpers = new HandlerHelpersClass();
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
  ui.setAttributes([submitButtonElement], ["disabled"], [""]);
  quizzerDataOperation
    .qtyOfQuestionsAvailable(
      categoryOptionElements[categorySelectElement.selectedIndex].value,
      difficultyOptionElements[difficultySelectElement.selectedIndex].value
    )
    .then((quantity) => {
      ui.attachText(
        [ui.getElements(".questionQuantityGroup .valid-feedback")[0]],
        [`Number of questions available: ${quantity}`]
      );
      quizzerData.updateConfigData([
        "numberOfQuestionsAvailableInSelection",
        quantity,
      ]);
      validateQuantityInput();
      ui.removeAttributes([submitButtonElement], ["disabled"]);
    });
}
function validateQuantityInput() {
  //Prevent user from exceeding limits for available number of questions
  handlerHelpers.limitNumericalEntry.call(
    questionQtyInputElement,
    [quizzerData.getConfigData("numberOfQuestionsAvailableInSelection"), 1],
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
    ui.getElements("#candidatesEmails")[0],
    questionQtyInputElement,
  ]);
  //save actions
  quizzerData.updateConfigData(["amount", numberOfQuestions]);
  handlerHelpers.helpSaveData(
    quizzerData.updateConfigData,
    "categoryName",
    selectedCategoryOptionElement.innerText
  );
  handlerHelpers.helpSaveData(
    quizzerData.updateConfigData,
    "category",
    selectedCategoryOptionElement.value
  );
  handlerHelpers.helpSaveData(
    quizzerData.updateConfigData,
    "difficulty",
    selectedDifficultyOptionElement.value
  );
  handlerHelpers.helpSaveData(
    quizzerData.updateConfigData,
    "type",
    selectedTypeOptionElement.value
  );
  handlerHelpers.helpSaveData(
    quizzerData.updateConfigData,
    "timing",
    selectedTimingOptionElement.value
  );
  if (
    testExpirationDateElement.valueAsNumber >= new Date().valueOf() ||
    testExpirationDateElement.valueAsNumber !==
      testExpirationDateElement.valueAsNumber
  ) {
    handlerHelpers.helpSaveData(
      quizzerData.updateConfigData,
      "expiryDate",
      testExpirationDateElement.valueAsNumber
    );
  } else {
    alert("Please speciify a future date for test expiration");
    ui.replaceHTML([modalBodyElement], [""]);
    return;
  }
  //Emails entry requires processing before save
  processEmailEntries(candidatesEmails);
  event.preventDefault();
}

function processEmailEntries(candidatesEmails) {
  //Validate emails and print links (if emails valid). Generate unique configuration link for each email
  ui.replaceHTML([modalBodyElement], [""]);

  candidatesEmails = candidatesEmails.trim();
  const candidatesEmailsArray = candidatesEmails.split(",");
  //Find any invalid emails
  let invalidEmail = candidatesEmailsArray.find((email) => {
    //loops over each email to check the number of at signs. There should be only one
    email = email.trim();
    let positionOfAtSign = -1;
    let numberOfAtSign = 0;
    while (
      (positionOfAtSign = email.indexOf("@", positionOfAtSign + 1)) !== -1
    ) {
      numberOfAtSign++;
    }
    return (
      //If an email conforms to any of these conditions, it is invalid
      !email.includes(".") ||
      email.includes("@.") ||
      email.startsWith("@") ||
      email.endsWith(".") ||
      numberOfAtSign === 0 ||
      numberOfAtSign > 1 ||
      email === "" ||
      email.includes(" ")
    );
  });

  //If email(s) all successfully validated, create links for them. Link elements when clicked should call function to copy unique configuration link to clipboard.
  if (candidatesEmails && !invalidEmail) {
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
      quizzerData.mapConfigDataClone(index); //map clone of unique configuration data for current email by index
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
  ],
  ["click", "input", "change"],
  [save_UI_Config_Entries, validateQuantityInput, checkAndValidateQuantityInput]
);
checkAndValidateQuantityInput();
