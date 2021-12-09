import { QuizzerDataClass } from "../Modules/app-data/app-data.js";
import { QuizzerDataOperationsClass } from "../Modules/app-data/app-data-operations.js";
import UI_InterfaceClass from "../Modules/ui/ui-interface.js";
import {
  HandlerHelpersClass,
  URL_HelperClass,
} from "../Modules/util/helpers.js";
import { CategoriesURL, quizPageRelativePath } from "../Modules/util/url.js";
import API_ServiceClass from "../services/api-service.js";
import { ClipboardClass } from "../services/user-agent.js";

// Instantiate business logic classes
const ui_Interface = new UI_InterfaceClass();
const API_Service = new API_ServiceClass();
const quizzerData = new QuizzerDataClass();
const quizzerDataOperation = new QuizzerDataOperationsClass(quizzerData);
const handlerHelpers = new HandlerHelpersClass();
const URL_Helper = new URL_HelperClass();
const clipBoardObj = new ClipboardClass();

// Import node objects from DOM
const questionQtyInputElement =
  ui_Interface.getElements("#amountOfQuestions")[0];
const categorySelectElement = ui_Interface.getElements("#categorySelect")[0];
const difficultySelectElement =
  ui_Interface.getElements("#difficultySelect")[0];
const typeSelectElement = ui_Interface.getElements("#typeSelect")[0];
const timingSelectElement = ui_Interface.getElements("#timingSelect")[0];
const difficultyOptionElements = Array.from(
  ui_Interface.getElements("#difficultySelect option")
);
const typeOptionElements = Array.from(
  ui_Interface.getElements("#typeSelect option")
);
const timingOptionElements = Array.from(
  ui_Interface.getElements("#timingSelect option")
);
const submitButtonElement = ui_Interface.getElements("#submitBtn")[0];
const testExpirationDateElement = ui_Interface.getElements("#expiryDate")[0];

//Make call for categories and attach them to category form element
quizzerData.updateData([
  "Quiz Categories",
  await API_Service.fetchData(CategoriesURL).then(
    (data) => data.trivia_categories
  ),
]);
quizzerData.getData("Quiz Categories").forEach((categoryObj) => {
  const optionElement = ui_Interface.createElements("option");
  ui_Interface.setAttributes([optionElement], ["value"], [categoryObj.id]);
  ui_Interface.attachText([optionElement], [categoryObj.name]);
  ui_Interface.attachElements(categorySelectElement, optionElement);
});
const categoryOptionElements = Array.from(
  ui_Interface.getElements("#categorySelect option")
);

//Check that categories data is saved/available in app data
if (
  quizzerDataOperation.isDataAvailable(
    quizzerData,
    "getData",
    "Quiz Categories"
  )
) {
  ui_Interface.removeElement(
    ui_Interface.getElements(".category-options-spinner")[0]
  );
}

function checkAndValidateQuantityInput() {
  /*Checks number of questions available, based on current form selection. Prevents submission while checking 
  Then validates quantity selected by user to ensure it is not more than available quantity
  */
  ui_Interface.setAttributes([submitButtonElement], ["disabled"], [""]);
  quizzerDataOperation
    .qtyOfQuestionsAvailable(
      categoryOptionElements[categorySelectElement.selectedIndex].value,
      difficultyOptionElements[difficultySelectElement.selectedIndex].value
    )
    .then((quantity) => {
      ui_Interface.attachText(
        [ui_Interface.getElements(".questionQuantityGroup .valid-feedback")[0]],
        [`Number of questions available: ${quantity}`]
      );
      quizzerData.updateConfigData([
        "numberOfQuestionsAvailableInSelection",
        quantity,
      ]);
      validateQuantityInput();
      ui_Interface.removeAttributes([submitButtonElement], ["disabled"]);
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
  let [candidatesEmails, numberOfQuestions] = ui_Interface.getInputValue([
    ui_Interface.getElements("#candidatesEmails")[0],
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
  handlerHelpers.helpSaveData(
    quizzerData.updateConfigData,
    "expiryDate",
    testExpirationDateElement.valueAsNumber
  );
  //Emails entry requires processing before save
  processEmailEntries(candidatesEmails);
  event.preventDefault();
}

function processEmailEntries(candidatesEmails) {
  //Validate emails and print links (if emails valid). Generate unique configuration link for each email
  const modalBodyElement = ui_Interface.getElements("#quiz-link-modal p")[0];
  ui_Interface.replaceHTML([modalBodyElement], [""]);

  candidatesEmails = candidatesEmails.trim();
  const candidatesEmailsArray = candidatesEmails.split(",");
  //Find any invalid emails
  let invalidEmail = candidatesEmailsArray.find((email) => {
    //loops over each email to check the number of at signs. There should be only one
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
      numberOfAtSign === 0 ||
      numberOfAtSign > 1
    );
  });

  if (candidatesEmails && !invalidEmail) {
    let emailsValidated;
    let index = 0;
    for (let candidateEmail of candidatesEmailsArray) {
      candidateEmail = candidateEmail.trim();
      if (candidateEmail !== "" && !candidateEmail.includes(" ")) {
        emailsValidated = true;
        quizzerData.updateConfigData(["candidateEmail", candidateEmail]);
        //ui_Interface.attachText([modalBodyElement], [location.origin + '/quiz?' + URL_Helper.generateTokenLink(URL_Helper.generateQuery(Array.from(quizzerData.getConfigData().entries())))]);
        let candidateEmailAnchorElement = ui_Interface.createElements("a");
        ui_Interface.setAttributes(
          [candidateEmailAnchorElement],
          ["href", "id"],
          ["#", index]
        );
        quizzerData.mapConfigDataClone(index);
        ui_Interface.addEventListenerToElements(
          [candidateEmailAnchorElement],
          ["click"],
          [
            function (e) {
              clipBoardObj.write(
                location.origin +
                  quizPageRelativePath +
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
                ui_Interface.addEventListenerToElements([candidateEmailAnchorElement], ['click'], [function () { clipBoardObj.write(location.origin + quizPageRelativePath + URL_Helper.generateTokenLink(URL_Helper.generateQuery(Array.from(Object.entries(quizzerData.getConfigData())), true))) }
                ]);
                */
        index++;
        ui_Interface.attachText(
          [candidateEmailAnchorElement],
          [`Click to copy link for Candidate (${candidateEmail})`]
        );
        ui_Interface.attachElements(
          modalBodyElement,
          candidateEmailAnchorElement
        );
      } else break;
    }
    if (emailsValidated) {
      ui_Interface.removeClassFromElements(
        [ui_Interface.getElements("#candidatesEmails")[0]],
        "is-invalid"
      );
      return;
    }
  }
  ui_Interface.attachText(
    [modalBodyElement],
    ["Invalid entry, please enter one or more comma separated email addresses"]
  );
  ui_Interface.addClassToElements(
    [ui_Interface.getElements("#candidatesEmails")[0]],
    "is-invalid"
  );
}

ui_Interface.addEventListenerToElements(
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
