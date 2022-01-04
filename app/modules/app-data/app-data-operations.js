//This module provides methods that run operations that rely on data in app-data module
import ApiServiceClass from "../../services/api-service.js";
import { LocalDataPersistenceClass } from "../../services/persistent-service.js";
import RouterService from "../../services/router.js";
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
      this.localDataService = new LocalDataPersistenceClass();
      this.router = new RouterService();
      //add fields to data storage map in AppData instance
      this.data.updateData(["scores", new Map()]);
      this.data.updateData(["selected options", new Map()]);
    }
  }
  async getQtyOfQuestionsAvailable(categoryId, difficulty) {
    if (+categoryId === 0) {
      //if categoryId is zero (all categories) get total number of questions
      this.data.updateData([
        "questionsCountInSelection",
        await apiService
          .fetchData(GLOBAL_QTY_OF_QUESTIONS_URL)
          .then((data) => data.overall.total_num_of_verified_questions),
      ]);
    }
    //else get number of questions for specified category and also difficulty
    else {
      let selectedCategoryCountData = await apiService
        .fetchData(QTY_OF_QUESTIONS_IN_CATEGORY_URL + categoryId)
        .then((data) => data.category_question_count);
      switch (difficulty) {
        case "easy":
          this.data.updateData([
            "questionsCountInSelection",
            selectedCategoryCountData.total_easy_question_count,
          ]);
          break;
        case "medium":
          this.data.updateData([
            "questionsCountInSelection",
            selectedCategoryCountData.total_medium_question_count,
          ]);
          break;
        case "hard":
          this.data.updateData([
            "questionsCountInSelection",
            selectedCategoryCountData.total_hard_question_count,
          ]);
          break;
        default:
          this.data.updateData([
            "questionsCountInSelection",
            selectedCategoryCountData.total_question_count,
          ]);
      }
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
        this.data.updateData(["totalTime", quantity * 10]);
        break;
      case "medium":
        this.data.updateData(["totalTime", quantity * 20]);
        break;
      case "hard":
        this.data.updateData(["totalTime", quantity * 30]);
        break;
      default:
        this.data.updateData(["totalTime", quantity * 20]);
        break;
    }
  }
  calculateTimeLeft(element) {
    //Implement countdown, update time everysecond and render on ui. Toggle classes
    let timeLeft = this.data.getData("totalTime");
    let timerId = setInterval(() => {
      --timeLeft;
      let minutes = Math.floor(timeLeft / 60);
      let seconds = timeLeft - minutes * 60;
      this.data.updateData(["timeLeft", [minutes, seconds]]);
      if (timeLeft == 0) {
        clearInterval(timerId);
        this.calculateScoresAndEndQuiz();
      }
    }, 1000);
  }
  score(selectedOption, questionId) {
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
