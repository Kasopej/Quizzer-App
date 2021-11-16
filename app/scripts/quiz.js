import { QuizzerDataClass } from "../modules/AppData/AppData.js";
import { QuizzerMiddleWareClass } from "../modules/MiddleWare/MiddleWare.js";
import UI_InterfaceClass from "../modules/UI/UI_Interface.js";
import { QuestionsURL } from "../modules/util/URL.js";
import { URL_HelperClass } from "../modules/util/URL_Helpers.js";
import API_ServiceClass from "../Services/API_Service.js";
import { LocalDataPersistenceClass } from "../Services/PersistentService.js";


const URL_Helper = new URL_HelperClass()
const API_Service = new API_ServiceClass()
const UI_Interface = new UI_InterfaceClass()
const QuizzerMiddleWare = new QuizzerMiddleWareClass();
const quizzerData = new QuizzerDataClass();
const localDataPersistenceService = new LocalDataPersistenceClass();
const localDataQuestions = localDataPersistenceService.getData('questions data')

if (!localDataQuestions) {
    const params = URL_Helper.getParamsFromQueryString(location.search.substr(1))
    const questions = await API_Service.fetchData(`${QuestionsURL}amount=${params.numberOfQuestions}&category=${params.selectedCategoryId}`).then(data => data.results);
    quizzerData.setData(['questions data', QuizzerMiddleWare.convertIncomingQuestionDataArray(questions)]);
    localDataPersistenceService.saveData('questions data', quizzerData.getData('questions data'));
    console.log('Getting --- API');
}
else {
    quizzerData.setData(['questions data', localDataQuestions]);
    console.log(quizzerData.getData(), 'got from --- localStorage');
}

let questionIndex = 0;
let questionsData = quizzerData.getData('questions data');
let questionObj = questionsData[questionIndex];


function renderQuizOnUI() {
    UI_Interface.attachText([UI_Interface.getElements('.card-text')[0]], [questionObj.question])
    let elementsNeeded = 'p'.repeat(questionObj.answers.length);
    let elementsCreated = UI_Interface.createElements(...elementsNeeded.split(''));
    elementsCreated.forEach((element, index) => {
        UI_Interface.attachHTML([element], [`<label><input type="radio" name="option" id="${index + 1}">${questionObj.answers[index].answer}</label>`])
    })
    UI_Interface.replaceChildren(UI_Interface.getElements('.answer-options')[0], elementsCreated)
}

renderQuizOnUI()


