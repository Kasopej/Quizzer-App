import { QuizzerDataClass } from "../modules/AppData/AppData.js";
import { QuizzerDataOperationsClass } from "../modules/AppData/AppDataoperations.js";
import { QuizzerMiddleWareClass } from "../modules/MiddleWare/MiddleWare.js";
import UI_InterfaceClass from "../modules/UI/UI_Interface.js";
import { QuestionsURL } from "../modules/util/URL.js";
import { URL_HelperClass } from "../modules/util/Helpers.js";
import API_ServiceClass from "../Services/API_Service.js";
import { sessionStoragePersistenceClass } from "../Services/PersistentService.js";


const URL_Helper = new URL_HelperClass()
const API_Service = new API_ServiceClass()
const UI_Interface = new UI_InterfaceClass()
const quizzerMiddleWare = new QuizzerMiddleWareClass();
const quizzerData = new QuizzerDataClass();
const quizzerDataOperation = new QuizzerDataOperationsClass(quizzerData);
const sessionStoragePersistenceService = new sessionStoragePersistenceClass();
const sessionStorageQuestions = sessionStoragePersistenceService.getData('questions data');
const sessionStorageConfigData = sessionStoragePersistenceService.getData('quizzer config data');

if (!sessionStorageQuestions && !sessionStorageConfigData) {
    const params = URL_Helper.getParamsFromQueryString(location.search.substr(1));
    quizzerData.updateConfigData(...Object.entries(params));
    sessionStoragePersistenceService.saveData('quizzer config data', params);
    const questions = await API_Service.fetchData(`${QuestionsURL}amount=${params.numberOfQuestions}&category=${params.selectedCategoryId}`).then(data => data.results);
    console.log(questions);
    quizzerData.updateData(['questions data', quizzerMiddleWare.convertIncomingQuestionDataArray(questions)]);
    sessionStoragePersistenceService.saveData('questions data', quizzerData.getData('questions data'));
}
else {
    quizzerData.updateData(['questions data', sessionStorageQuestions]);
    quizzerData.updateConfigData(...Object.entries(sessionStorageConfigData));
}

let questionIndex = 0;
let questionsData = quizzerData.getData('questions data');
console.log(questionsData);
if (quizzerDataOperation.checkIfQuizIsTimed()) {
    quizzerDataOperation.calcTotalTime();
    quizzerDataOperation.updateAndRenderTimeLeft(UI_Interface.getElements('#timer')[0]);
}

function renderQuizOnUI() {
    UI_Interface.replaceHTML([UI_Interface.getElements('#question')[0]], [decodeURI(questionsData[questionIndex].question)])
    UI_Interface.attachText(Array.from(UI_Interface.getElements('.quizNumberTracker h2')), ['Question', `${questionIndex + 1}`, `${questionsData.length}`]);
    let elementsCreated = UI_Interface.createElements(...'li '.repeat(questionsData[questionIndex].answers.length).split(' ').slice(0, questionsData[questionIndex].answers.length));
    elementsCreated.forEach((element, index) => {
        UI_Interface.replaceHTML([element], [`<label><input type="radio" name="option" value="${index + 1}" id="${index + 1}">${decodeURI(questionsData[questionIndex].answers[index].answer)}</label>`]);
    });
    UI_Interface.replaceChildren(UI_Interface.getElements('.answerOptions')[0], elementsCreated);
    const optionElementsArray = Array.from(UI_Interface.getElements('.answerOptions input'));
    UI_Interface.addEventListenerToElements(optionElementsArray, ['change'], [function () {
        quizzerDataOperation.checkAnswer(UI_Interface.getInputValue([this])[0], questionIndex)
    }]);
    let selectedOptionIndex = quizzerData.getData('selected options').get(questionIndex);
    if (selectedOptionIndex != undefined) {
        UI_Interface.setAttributes([optionElementsArray[selectedOptionIndex]], ['checked'], ['']);
    }

    (!questionIndex) ? UI_Interface.addClassToElements([UI_Interface.getElements('#prev')[0]], 'invisible') : UI_Interface.removeClassFromElements([UI_Interface.getElements('#prev-btn')[0]], 'invisible');

    (questionIndex === questionsData.length - 1) ? UI_Interface.addClassToElements([UI_Interface.getElements('#next-btn')[0]], 'invisible') : UI_Interface.removeClassFromElements([UI_Interface.getElements('#next')[0]], 'invisible');
}

UI_Interface.addEventListenerToElements([UI_Interface.getElements('#prev')[0]], ['click'], [function (event) {
    questionIndex = (questionIndex > 0) ? --questionIndex : questionIndex;
    renderQuizOnUI();
    event.preventDefault();
}
]
);
UI_Interface.addEventListenerToElements([UI_Interface.getElements('#next')[0]], ['click'], [function (event) {
    questionIndex = (questionIndex < questionsData.length - 1) ? ++questionIndex : questionIndex;
    renderQuizOnUI();
    event.preventDefault();
}]
);
UI_Interface.addEventListenerToElements([UI_Interface.getElements('#submitBtn')[0]], ['click'], [function (event) {
    quizzerDataOperation.calculateScoresAndEndQuiz();
    event.preventDefault();
}])
renderQuizOnUI()
