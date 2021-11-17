import { QuizzerDataClass } from "../modules/AppData/AppData.js";
import { QuizzerDataOperationsClass } from "../modules/AppData/AppDataoperations.js";
import { QuizzerMiddleWareClass } from "../modules/MiddleWare/MiddleWare.js";
import UI_InterfaceClass from "../modules/UI/UI_Interface.js";
import { QuestionsURL } from "../modules/util/URL.js";
import { URL_HelperClass } from "../modules/util/URL_Helpers.js";
import API_ServiceClass from "../Services/API_Service.js";
import { sessionStoragePersistenceClass } from "../Services/PersistentService.js";


const URL_Helper = new URL_HelperClass()
const API_Service = new API_ServiceClass()
const UI_Interface = new UI_InterfaceClass()
const QuizzerMiddleWare = new QuizzerMiddleWareClass();
const quizzerData = new QuizzerDataClass();
const sessionStoragePersistenceService = new sessionStoragePersistenceClass();
const sessionStorageQuestions = sessionStoragePersistenceService.getData('questions data');
const sessionStorageConfigData = sessionStoragePersistenceService.getData('quizzer config data');
const quizzerDataOperation = new QuizzerDataOperationsClass(quizzerData);

if (!sessionStorageQuestions && !sessionStorageConfigData) {
    const params = URL_Helper.getParamsFromQueryString(location.search.substr(1));
    quizzerData.setConfigData(...Object.entries(params));
    sessionStoragePersistenceService.saveData('quizzer config data', params);
    const questions = await API_Service.fetchData(`${QuestionsURL}amount=${params.numberOfQuestions}&category=${params.selectedCategoryId}`).then(data => data.results);
    quizzerData.setData(['questions data', QuizzerMiddleWare.convertIncomingQuestionDataArray(questions)]);
    sessionStoragePersistenceService.saveData('questions data', quizzerData.getData('questions data'));
}
else {
    quizzerData.setData(['questions data', sessionStorageQuestions]);
    quizzerData.setConfigData(...Object.entries(sessionStorageConfigData));
}

let questionIndex = 0;
let questionsData = quizzerData.getData('questions data');
if (quizzerDataOperation.checkIfQuizIsTimed()) {
    quizzerDataOperation.calcTotalTime();
    quizzerDataOperation.updateAndRenderTimeLeft(UI_Interface.getElements('.timer span')[0]);
}

function renderQuizOnUI() {
    UI_Interface.attachText([UI_Interface.getElements('.card-text')[0]], [questionsData[questionIndex].question])
    UI_Interface.attachText([UI_Interface.getElements('.card-title')[0]], [`Q${questionIndex + 1}`])
    //let elementsNeeded = 'p'.repeat(questionsData[questionIndex].answers.length);
    let elementsCreated = UI_Interface.createElements(...'p'.repeat(questionsData[questionIndex].answers.length).split(''));
    elementsCreated.forEach((element, index) => {
        UI_Interface.attachHTML([element], [`<label><input type="radio" name="option" value="${index + 1}" id="${index + 1}">${questionsData[questionIndex].answers[index].answer}</label>`])
    });
    UI_Interface.replaceChildren(UI_Interface.getElements('.answer-options')[0], elementsCreated);
    const optionElementsArray = Array.from(UI_Interface.getElements('.answer-options input'));
    UI_Interface.addEventListenerToElements(optionElementsArray, ['change'], [function () {
        quizzerDataOperation.checkAnswer(UI_Interface.getInputValue([this])[0], questionIndex)
    }]);
    let previouslySelectedOptionIndex = quizzerData.getData('selected options').get(questionIndex);
    console.log('Rendering: ' + previouslySelectedOptionIndex);
    if (previouslySelectedOptionIndex != undefined) {
        console.log('Has been answered');
        UI_Interface.setAttributes([optionElementsArray[previouslySelectedOptionIndex]], ['checked'], ['']);
    }
}

UI_Interface.addEventListenerToElements([UI_Interface.getElements('#prev-btn')[0]], ['click'], [function (event) {
    questionIndex = (questionIndex > 0) ? --questionIndex : questionIndex;
    renderQuizOnUI();
    event.preventDefault();
}]
);
UI_Interface.addEventListenerToElements([UI_Interface.getElements('#next-btn')[0]], ['click'], [function (event) {
    questionIndex = (questionIndex < questionsData.length - 1) ? ++questionIndex : questionIndex;
    renderQuizOnUI();
    event.preventDefault();
}]
);
UI_Interface.addEventListenerToElements([UI_Interface.getElements('#submit-btn')[0]], ['click'], [function (event) {
    quizzerDataOperation.calculateScores();
    event.preventDefault();
}])
renderQuizOnUI()
