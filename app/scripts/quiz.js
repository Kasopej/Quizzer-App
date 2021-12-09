import { QuizzerDataClass } from "../modules/app-data/app-data.js";
import { QuizzerDataOperationsClass } from "../modules/app-data/app-data-operations.js";
import { QuizzerMiddlewareClass } from "../modules/middleware/middleware.js";
import UiClass from "../modules/ui/ui.js";
import { QuestionsURL } from "../modules/Util/url.js";
import { UrlHelperClass } from "../modules/util/helpers.js";
import ApiServiceClass from "../services/api-service.js";
import { sessionStoragePersistenceClass } from "../services/persistent-service.js";

// Instantiate business logic classes
const urlHelper = new UrlHelperClass();
const apiService = new ApiServiceClass();
const ui = new UiClass();
const quizzerMiddleware = new QuizzerMiddlewareClass();
const quizzerData = new QuizzerDataClass();
const quizzerDataOperation = new QuizzerDataOperationsClass(quizzerData);
const sessionStoragePersistenceService = new sessionStoragePersistenceClass();
const sessionStorageQuestions =
  sessionStoragePersistenceService.getData("questions data");
const sessionStorageConfigData = sessionStoragePersistenceService.getData(
  "quizzer config data"
);

//Call for questions from API if not saved in session storage. Remove splash screen if questions called & saved in app(quizzer) data successfully
if (!sessionStorageQuestions && !sessionStorageConfigData) {
  const params = urlHelper.getParamsFromQueryString(location.search.substr(1));
  quizzerData.updateConfigData(...Object.entries(params));
  sessionStoragePersistenceService.saveData("quizzer config data", params);
  const questions = await apiService
    .fetchData(
      `${QuestionsURL}${urlHelper.generateQuery(
        Object.entries(quizzerData.getConfigData()),
        true,
        [
          "numberOfQuestionsAvailableInSelection",
          "candidateEmail",
          "categoryName",
          "timing",
          "expiryDate",
        ]
      )}`
    )
    .then((data) => data.results);
  quizzerData.updateData([
    "questions data",
    quizzerMiddleware.convertIncomingQuestionDataArray(questions),
  ]);
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

function expireTest() {
  questionsData = [];
  alert("Test has expired!");
  ui.replaceHTML([ui.getElements("body")[0]], [""]);
}
let questionIndex = 0;
let questionsData = quizzerData.getData("questions data");

console.log(+quizzerData.getConfigData("expiryDate"));
console.log(new Date().valueOf);
if (+quizzerData.getConfigData("expiryDate") < new Date().valueOf()) {
  expireTest();
}

//Implement time countdown if test is timed
if (quizzerDataOperation.checkIfQuizIsTimed()) {
  quizzerDataOperation.calcTotalTime();
  quizzerDataOperation.updateAndRenderTimeLeft(ui.getElements("#timer")[0]);
}

function renderQuizOnUI() {
  //Render current questions with options on UI. Implement functionality to recover previous selections. Implement functionality to toggle control buttons on & off
  ui.replaceHTML(
    [ui.getElements("#question")[0]],
    [decodeURI(questionsData[questionIndex].question)]
  );
  ui.attachText(Array.from(ui.getElements(".quizNumberTracker h2")), [
    "Question",
    `${questionIndex + 1}`,
    `${questionsData.length}`,
  ]);
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
  ui.replaceChildren(ui.getElements(".answerOptions")[0], elementsCreated);
  const optionElementsArray = Array.from(
    ui.getElements(".answerOptions input")
  );
  ui.addEventListenerToElements(
    optionElementsArray,
    ["change"],
    [
      function () {
        quizzerDataOperation.checkAnswer(
          ui.getInputValue([this])[0],
          questionIndex
        );
        quizzerData.updateData(["currentQuestionAttempted", true]);
      },
    ]
  );
  quizzerData.updateData(["currentQuestionAttempted", false]);
  let selectedOptionIndex = quizzerData
    .getData("selected options")
    .get(questionIndex);
  if (selectedOptionIndex != undefined) {
    ui.setAttributes(
      [optionElementsArray[selectedOptionIndex]],
      ["checked"],
      [""]
    );
    quizzerData.updateData(["currentQuestionAttempted", true]);
  }

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
        quizzerDataOperation.calculateScoresAndEndQuiz();
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
