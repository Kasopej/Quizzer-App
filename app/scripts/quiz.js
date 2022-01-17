import { QuizzerDataClass } from "../modules/app-data/app-data.js";
import { QuizzerDataOperationsClass } from "../modules/app-data/app-data-operations.js";
import { QuizzerMiddlewareClass } from "../modules/middleware/middleware.js";
import UiClass from "../modules/ui/ui.js";
import { QUESTIONS_URL } from "../modules/util/url.js";
import { UrlHelperClass } from "../modules/util/helpers.js";
import ApiServiceClass from "../services/api-service.js";
import { SessionStoragePersistenceClass } from "../services/persistent-service.js";
import RouterService from "../services/router.js";
import { questionBag } from "../data/demo-test-questions.js";

// Instantiate business logic classes
const urlHelper = new UrlHelperClass();
const apiService = new ApiServiceClass();
const ui = new UiClass();
const quizzerMiddleware = new QuizzerMiddlewareClass();
const quizzerData = new QuizzerDataClass();
const quizzerDataOperation = new QuizzerDataOperationsClass(quizzerData);
const sessionStoragePersistenceService = new SessionStoragePersistenceClass();
const sessionStorageQuestions =
  sessionStoragePersistenceService.getData("questions data");
const sessionStorageConfigData = sessionStoragePersistenceService.getData(
  "quizzer config data"
);
const router = new RouterService();

//Call for questions from API if not saved in session storage. Remove splash screen if questions called & saved in app(quizzer) data successfully
if (!sessionStorageQuestions || !sessionStorageConfigData) {
  const params = urlHelper.getParamsFromQueryString(location.search.substr(1));
  quizzerData.updateConfigData(...Object.entries(params));
  sessionStoragePersistenceService.saveData("quizzer config data", params);
  /*
  const questions = await apiService
    .fetchData(
      `${QUESTIONS_URL}${urlHelper.generateQuery(
        Object.entries(quizzerData.getConfigData()),
        true,
        ["candidateEmail", "categoryName", "timing", "expiryDate"]
      )}`
    )
    .then((data) => data.results);
  quizzerData.updateData([
    "questions data",
    quizzerMiddleware.convertIncomingQuestionDataArray(questions),
  ]);
  */
  quizzerData.updateData(["questions data", questionBag]);
  sessionStoragePersistenceService.saveData(
    "questions data",
    quizzerData.getData("questions data")
  );
  if (
    quizzerDataOperation.isDataAvailable(
      quizzerData,
      "getData",
      "questions data"
    )
  ) {
    ui.removeElement(ui.getElements(".splashScreen")[0]);
  }
} else {
  //get questions from session storage. Remove splash screen if questions obtained & saved successfully
  quizzerData.updateData(["questions data", sessionStorageQuestions]);
  quizzerData.updateConfigData(...Object.entries(sessionStorageConfigData));
  if (
    quizzerDataOperation.isDataAvailable(
      quizzerData,
      "getData",
      "questions data"
    )
  ) {
    ui.removeElement(ui.getElements(".splashScreen")[0]);
  }
}

let questionIndex = 0;
let questionsData = quizzerData.getData("questions data");

function expireTest() {
  questionsData = [];
  alert("Test has expired!");
  ui.replaceHTML([ui.getElements("body")[0]], [""]);
}

if (+quizzerData.getConfigData("expiryDate") < new Date().valueOf()) {
  expireTest();
}

//Implement time countdown if test is timed
if (quizzerDataOperation.checkIfQuizIsTimed()) {
  quizzerDataOperation.calcTotalTime();
  quizzerDataOperation.calculateTimeLeft();
  let interval = setInterval(() => {
    let timeLeftArray = quizzerData.getData("timeLeftArray");
    if (timeLeftArray[0] || timeLeftArray[1]) {
      ui.attachText(
        [ui.getElements("#timer")[0]],
        [`${timeLeftArray[0]}m : ${timeLeftArray[1]}s`]
      );
    } else {
      setTimeout(() => {
        router.redirect("quiz-finished.html");
      }, 1000);
    }
  }, 1000);
}

function renderQuizOnUI() {
  //Render current questions with options on UI. Implement functionality to recover previous selections. Implement functionality to toggle visibility of buttons on & off
  ui.replaceHTML(
    [ui.getElements("#question")[0]],
    [decodeURI(questionsData[questionIndex].question)]
  );
  //get all h2 elements from specified selector and populate them with strings in the array. See attachText method in ui module
  ui.attachText(Array.from(ui.getElements(".quizNumberTracker h2")), [
    "Question",
    `${questionIndex + 1}`,
    `${questionsData.length}`,
  ]);
  //create list html elements for each option in current question object
  let elementsCreated = ui.createElements(
    ..."li "
      .repeat(questionsData[questionIndex].answers.length)
      .split(" ")
      .slice(0, questionsData[questionIndex].answers.length)
  );
  elementsCreated.forEach((element, index) => {
    ui.replaceHTML(
      [element],
      [
        `<label><input type="radio" name="option" value="${index + 1}" id="${
          index + 1
        }">${decodeURI(
          questionsData[questionIndex].answers[index].answer
        )}</label>`,
      ]
    );
  });
  //attach elements to DOM
  ui.replaceChildren(ui.getElements(".answerOptions")[0], elementsCreated);
  const optionElementsArray = Array.from(
    ui.getElements(".answerOptions input")
  );
  ui.addEventListenerToElements(
    optionElementsArray,
    ["change"],
    [
      function () {
        //check if selected option is current and score, store attempt
        quizzerDataOperation.score(ui.getInputValue([this])[0], questionIndex);
        quizzerData.updateData(["currentQuestionAttempted", true]);
      },
    ]
  );

  //upon rendering question, set attempted state to false
  quizzerData.updateData(["currentQuestionAttempted", false]);
  let selectedOptionIndex = quizzerData
    .getData("selected options")
    .get(questionIndex);
  //Check if question has previously been attempted and update ui with the previous selection, and change state to attempted
  if (selectedOptionIndex != undefined) {
    ui.setAttributes(
      [optionElementsArray[selectedOptionIndex]],
      ["checked"],
      [""]
    );
    quizzerData.updateData(["currentQuestionAttempted", true]);
  }
  //Toggle visibility of control buttons
  !questionIndex
    ? ui.addClassToElements([ui.getElements("#prev")[0]], "invisible")
    : ui.removeClassFromElements([ui.getElements("#prev")[0]], "invisible");

  questionIndex === questionsData.length - 1
    ? ui.addClassToElements([ui.getElements("#next")[0]], "invisible")
    : ui.removeClassFromElements([ui.getElements("#next")[0]], "invisible");

  !(questionIndex === questionsData.length - 1)
    ? ui.addClassToElements([ui.getElements("#submitBtn")[0]], "display-none")
    : ui.removeClassFromElements(
        [ui.getElements("#submitBtn")[0]],
        "display-none"
      );
}

ui.addEventListenerToElements(
  [ui.getElements("#prev")[0]],
  ["click"],
  [
    function (event) {
      questionIndex = questionIndex > 0 ? --questionIndex : questionIndex;
      renderQuizOnUI();
      event.preventDefault();
    },
  ]
);
ui.addEventListenerToElements(
  [ui.getElements("#next")[0]],
  ["click"],
  [
    function (event) {
      if (quizzerData.getData("currentQuestionAttempted")) {
        questionIndex =
          questionIndex < questionsData.length - 1
            ? ++questionIndex
            : questionIndex;
        renderQuizOnUI();
      } else {
        ui.addClassToElements([ui.getElements("#infoAlert")[0]], "d-block");
      }
      event.preventDefault();
    },
  ]
);
ui.addEventListenerToElements(
  [ui.getElements("#submitBtn")[0]],
  ["click"],
  [
    function (event) {
      if (quizzerData.getData("currentQuestionAttempted")) {
        quizzerDataOperation.totalScoresAndSaveResult();
        router.redirect("quiz-finished.html");
      } else {
        ui.addClassToElements([ui.getElements("#infoAlert")[0]], "d-block");
      }
      event.preventDefault();
    },
  ]
);

ui.addEventListenerToElements(
  [ui.getElements("#closeInfoAlert")[0]],
  ["click"],
  [
    function () {
      ui.removeClassFromElements([ui.getElements("#infoAlert")[0]], "d-block");
    },
  ]
);
ui.addEventListenerToElements(
  [ui.getElements("#infoAlert")[0]],
  ["click"],
  [
    function () {
      ui.removeClassFromElements([ui.getElements("#infoAlert")[0]], "d-block");
    },
  ]
);
renderQuizOnUI();
