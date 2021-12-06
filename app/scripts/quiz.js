import { QuizzerDataClass } from "../modules/AppData/appData.js";
import { QuizzerDataOperationsClass } from "../modules/AppData/appDataOperations.js";
import { QuizzerMiddleWareClass } from "../modules/MiddleWare/middleWare.js";
import UI_InterfaceClass from "../modules/UI/ui_Interface.js";
import { QuestionsURL } from "../modules/Util/url.js";
import { URL_HelperClass } from "../modules/util/helpers.js";
import API_ServiceClass from "../Services/apiService.js";
import { sessionStoragePersistenceClass } from "../Services/persistentService.js";


const URL_Helper = new URL_HelperClass()
const API_Service = new API_ServiceClass()
const UI_Interface = new UI_InterfaceClass()
const quizzerMiddleWare = new QuizzerMiddleWareClass();
const quizzerData = new QuizzerDataClass();
const quizzerDataOperation = new QuizzerDataOperationsClass(quizzerData);
const sessionStoragePersistenceService = new sessionStoragePersistenceClass();
const sessionStorageQuestions = sessionStoragePersistenceService.getData('questions data');
const sessionStorageConfigData = sessionStoragePersistenceService.getData('quizzer config data');

//Call for questions from API if not saved in session storage. Remove splash screen if questions called & saved successfully
if (!sessionStorageQuestions && !sessionStorageConfigData) {
    const params = URL_Helper.getParamsFromQueryString(location.search.substr(1));
    quizzerData.updateConfigData(...Object.entries(params));
    sessionStoragePersistenceService.saveData('quizzer config data', params);
    const questions = await API_Service.fetchData(`${QuestionsURL}+ ${URL_Helper.generateQuery(Object.entries(quizzerData.getConfigData()), true, ['numberOfQuestionsAvailableInSelection', 'candidateEmail', 'categoryName', 'timing', 'expiryDate'])}`).then(data => data.results);
    quizzerData.updateData(['questions data', quizzerMiddleWare.convertIncomingQuestionDataArray(questions)]);
    sessionStoragePersistenceService.saveData('questions data', quizzerData.getData('questions data'));
    if (quizzerDataOperation.isDataAvailable(quizzerData, 'getData', 'questions data')) {
        UI_Interface.removeElement(UI_Interface.getElements('.splashScreen')[0])
    }
}
else { //get questions from session storage. Remove splash screen if questions obtained & saved successfully
    quizzerData.updateData(['questions data', sessionStorageQuestions]);
    quizzerData.updateConfigData(...Object.entries(sessionStorageConfigData));
    if (quizzerDataOperation.isDataAvailable(quizzerData, 'getData', 'questions data')) {
        UI_Interface.removeElement(UI_Interface.getElements('.splashScreen')[0])
    }
}

let questionIndex = 0;
let questionsData = quizzerData.getData('questions data');
if (quizzerData.getConfigData('expiryDate') < new Date().valueOf) {
    questionsData = [];
    alert('Test has expired!')
    UI_Interface.replaceHTML([UI_Interface.getElements('body')[0]], ['']);
}

//Implement time countdown if test is timed
if (quizzerDataOperation.checkIfQuizIsTimed()) {
    quizzerDataOperation.calcTotalTime();
    quizzerDataOperation.updateAndRenderTimeLeft(UI_Interface.getElements('#timer')[0]);
}

function renderQuizOnUI() { //Render current questions with options on UI. Implement functionality to recover previous selections. Implement functionality to toggle control buttons on & off
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
        quizzerData.updateData(['currentQuestionAttempted', true]);
    }]);
    quizzerData.updateData(['currentQuestionAttempted', false]);
    let selectedOptionIndex = quizzerData.getData('selected options').get(questionIndex);
    if (selectedOptionIndex != undefined) {
        UI_Interface.setAttributes([optionElementsArray[selectedOptionIndex]], ['checked'], ['']);
        quizzerData.updateData(['currentQuestionAttempted', true]);
    }

    (!questionIndex) ? UI_Interface.addClassToElements([UI_Interface.getElements('#prev')[0]], 'invisible') : UI_Interface.removeClassFromElements([UI_Interface.getElements('#prev')[0]], 'invisible');

    (questionIndex === questionsData.length - 1) ? UI_Interface.addClassToElements([UI_Interface.getElements('#next')[0]], 'invisible') : UI_Interface.removeClassFromElements([UI_Interface.getElements('#next')[0]], 'invisible');

    !(questionIndex === questionsData.length - 1) ? UI_Interface.addClassToElements([UI_Interface.getElements('#submitBtn')[0]], 'display-none') : UI_Interface.removeClassFromElements([UI_Interface.getElements('#submitBtn')[0]], 'display-none');
}



UI_Interface.addEventListenerToElements([UI_Interface.getElements('#prev')[0]], ['click'], [function (event) {
    questionIndex = (questionIndex > 0) ? --questionIndex : questionIndex;
    renderQuizOnUI();
    event.preventDefault();
}
]
);
UI_Interface.addEventListenerToElements([UI_Interface.getElements('#next')[0]], ['click'], [function (event) {
    if (quizzerData.getData('currentQuestionAttempted')) {
        questionIndex = (questionIndex < questionsData.length - 1) ? ++questionIndex : questionIndex;
        renderQuizOnUI();
        let invodivEl = document.getElementById('informationDiv');
        invodivEl.style.display = "none";
    }
    else {
        // alert('Select an option first')
        let invodivEl = document.getElementById('informationDiv');
        invodivEl.style.display = "block";
    }
    event.preventDefault();
}]
);
UI_Interface.addEventListenerToElements([UI_Interface.getElements('#submitBtn')[0]], ['click'], [function (event) {
    if (quizzerData.getData('currentQuestionAttempted')) {
        quizzerDataOperation.calculateScoresAndEndQuiz();
    }
    else {
        let invodivEl = document.getElementById('informationDiv');
        invodivEl.style.display = "block";
    }
    event.preventDefault();
}])
let closeInfoDiv = document.getElementById('closeInfoDiv');
closeInfoDiv.addEventListener('click', function () {
    let invodivEl = document.getElementById('informationDiv');
    invodivEl.style.display = "none";
});
window.onclick = function (event) {
    let invodivEl = document.getElementById('informationDiv');
    if (event.target == invodivEl) {
        invodivEl.style.display = "none";
    }
}
renderQuizOnUI()
