//This module provides methods that run operations that rely on data in app-data module
import ApiServiceClass from "../../services/api-service.js";
import { LocalDataPersistenceClass } from "../../services/persistent-service.js";
import RouterService from "../../services/router.js";
import UiClass from "../ui/ui.js";
import {
  GLOBAL_QTY_OF_QUESTIONS_URL,
  QTY_OF_QUESTIONS_IN_CATEGORY_URL,
} from "../util/url.js";
import { AppDataClass } from "./app-data.js";

const apiService = new ApiServiceClass();

export class AppDataOperationsClass {
  //base class that QuizzerDataOperationsClass is extended from. Allows for logical extension of application beyond quizzer solution
  isDataAvailable(dataObject, getter, key) {
    //Checks if data requested is available in AppData and returns a boolean
    let dataAvailable;
    dataAvailable = dataObject[getter](key);
    if (Array.isArray(dataAvailable)) {
      return (dataAvailable = dataObject[getter](key).length ? true : false);
    }
  }
}
export class QuizzerDataOperationsClass extends AppDataOperationsClass {
  //Extension of base AppDataOperationsClass to provide functionality specific to quizzer

  constructor(data /*expecting AppDataClass instance at call*/) {
    if (data instanceof AppDataClass) {
      super();
      this.data = data;
      this.ui = new UiClass();
      this.localDataService = new LocalDataPersistenceClass();
      this.router = new RouterService();
      //add fields to data storage map in AppData instance
      this.data.updateData(["scores", new Map()]);
      this.data.updateData(["selected options", new Map()]);
    }
  }
  async qtyOfQuestionsAvailable(categoryId, difficulty) {
    if (+categoryId === 0) {
      //if categoryId is zero (all categories) get total number of questions
      this.data.updateData([
        "globalQtyOfAvailableQuestions",
        await apiService
          .fetchData(GLOBAL_QTY_OF_QUESTIONS_URL)
          .then((data) => data.overall.total_num_of_verified_questions),
      ]);
      return this.data.getData("globalQtyOfAvailableQuestions");
    }
    //else get number of questions for specified category and also difficulty
    this.data.updateData([
      "availableQuestionsInCategory",
      await apiService
        .fetchData(QTY_OF_QUESTIONS_IN_CATEGORY_URL + categoryId)
        .then((data) => data.category_question_count),
    ]);
    switch (difficulty) {
      case "easy":
        return this.data.getData("availableQuestionsInCategory")
          .total_easy_question_count;
      case "medium":
        return this.data.getData("availableQuestionsInCategory")
          .total_medium_question_count;
      case "hard":
        return this.data.getData("availableQuestionsInCategory")
          .total_hard_question_count;
      default:
        return this.data.getData("availableQuestionsInCategory")
          .total_question_count;
    }
  }
  checkIfQuizIsTimed() {
    //checks value of timing field in configDate object in AppData instance
    let timing = this.data.getConfigData("timing").slice(0, -7);
    return (timing = timing == "Timed" ? true : false);
  }
  calcTotalTime() {
    //calculates total time to allocate to test based on selected amount of questions & difficulty
    const difficulty = this.data.getConfigData("difficulty");
    const quantity = this.data.getConfigData("amount");
    switch (difficulty) {
      case "easy":
        this._totalTime = quantity * 10;
        break;
      case "medium":
        this._totalTime = quantity * 20;
        break;
      case "hard":
        this._totalTime = quantity * 30;
        break;
      default:
        this._totalTime = quantity * 20;
        //Implement default timing
        break;
    }
  }
  updateAndRenderTimeLeft(element) {
    //Implement countdown, update time everysecond and render on ui. Toggle classes
    let timerId = setInterval(() => {
      --this._totalTime;
      let minutes = Math.floor(this._totalTime / 60);
      let seconds = this._totalTime - minutes * 60;
      let colorClasses = ["black-text", "red-text"];
      let selectedIndex = Math.floor(Math.random() * 2);
      let unselectedIndex = selectedIndex == 0 ? 1 : 0;
      this.ui.attachText([element], [`${minutes}m : ${seconds}s`]);
      this.ui.replaceClassOnElements(
        [element],
        [colorClasses[unselectedIndex], colorClasses[selectedIndex]]
      );
      if (this._totalTime == 0) {
        clearInterval(timerId);
        this.calculateScoresAndEndQuiz();
      }
    }, 1000);
  }
  checkAnswer(selectedOption, questionId) {
    //compares selected option to correct answer in AppData instance. Updates score
    if (
      selectedOption == this.data.getData("questions data")[questionId].answerId
    ) {
      let score = 1;
      this.data.getData("selected options").set(questionId, selectedOption - 1);
      this.data.getData("scores").set(questionId, score);
      return;
    }
    let score = 0;
    this.data.getData("selected options").set(questionId, selectedOption - 1);
    this.data.getData("scores").set(questionId, score);
  }
  getAnswer() {}
  getCategories() {}
  calculateScoresAndEndQuiz() {
    //Actions to end quiz. Calculates total scores from scores saved in AppData instance, saves result & test data in local storage and redirects to finish quiz page
    let candidateEmail = this.data
      .getConfigData("candidateEmail")
      .replace("%20", " ");
    let totalScore = Array.from(this.data.getData("scores").values()).reduce(
      (a, b) => {
        return a + b;
      },
      0
    );
    this.data.updateData(["total score", totalScore]);
    if (!this.localDataService.getData("resultsData")) {
      //creates array for saving results data if it does not exist
      this.localDataService.saveData("resultsData", []);
    }
    //gets and updates array saved in local storage
    let resultsArray = this.localDataService.getData("resultsData");
    resultsArray.push({
      candidateEmail: candidateEmail,
      timeStamp: new Date().valueOf(),
      score: `${this.data.getData("total score")}/${
        this.data.getData("questions data").length
      }`,
    });
    this.localDataService.saveData("resultsData", resultsArray);
    this.router.redirect("quiz-finished.html");
  }
}
