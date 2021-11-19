import { QuizzerDataClass } from "../modules/AppData/AppData.js";
import UI_InterfaceClass from "../modules/UI/UI_Interface.js";
import { HandlerHelpersClass, URL_HelperClass } from "../modules/util/Helpers.js";
import { qtyOfQuestionsInCategoryURL } from "../modules/util/URL.js";
import API_ServiceClass from "../Services/API_Service.js";
import { LocalDataPersistenceClass } from "../Services/PersistentService.js";
import { ClipboardClass } from "../Services/UserAgent.js";

const localDataPersistenceService = new LocalDataPersistenceClass();
const quizzerData = new QuizzerDataClass();
const UI_Interface = new UI_InterfaceClass();
const API_Service = new API_ServiceClass();
const HandlerHelpers = new HandlerHelpersClass()
const URL_Helper = new URL_HelperClass();
const clipBoardObj = new ClipboardClass();
const localDataQuizzerConfigDataObj = localDataPersistenceService.getData('Quizzer Config Data')
let selectedCategoryName, selectedCategoryId;


if (localDataQuizzerConfigDataObj) {
    Object.entries(localDataQuizzerConfigDataObj).forEach(entryArray => quizzerData.setConfigData(entryArray))
    selectedCategoryName = quizzerData.getConfigData('selectedCategoryName');
    selectedCategoryId = quizzerData.getConfigData('selectedCategoryId');
}
else { location.replace(location.origin) }

UI_Interface.attachText([UI_Interface.getElements('.language-specific-options fieldset legend')[0]], [selectedCategoryName + ' Quiz Setup']);
const qtyOfAvailableQuestionsInCategory = await API_Service.fetchData(qtyOfQuestionsInCategoryURL + selectedCategoryId).then(data => data.category_question_count.total_question_count);

const selectQuestionsQtyElement = UI_Interface.getElements('#questions-quantity')[0];
UI_Interface.addEventListenerToElements([selectQuestionsQtyElement], ['input'], [function () {
    HandlerHelpers.limitNumericalEntry.call(this, qtyOfAvailableQuestionsInCategory, 'max')
}]
);

UI_Interface.addEventListenerToElements([UI_Interface.getElements('.quiz-link-btn')[0]], ['click'],
    [function () {
        const modalBodyElement = UI_Interface.getElements('#quiz-link-modal .modal-body p')[0];
        UI_Interface.replaceHTML([modalBodyElement], ['']);

        let [candidatesEmails, numberOfQuestions, timing] = UI_Interface.getInputValue([UI_Interface.getElements('#candidates-emails')[0], selectQuestionsQtyElement, Array.from(UI_Interface.getElements(".timing[type = 'radio']")).find(radioElement => radioElement.checked)]);
        let candidatesEmailsArray = candidatesEmails.split(',');

        if (candidatesEmails) {
            for (let candidateEmail of candidatesEmailsArray) {
                candidateEmail = candidateEmail.trim()
                quizzerData.setConfigData(['candidateEmail', candidateEmail], ['timing', timing], ['numberOfQuestions', numberOfQuestions]);
                //UI_Interface.attachText([modalBodyElement, [location.origin + '/quiz?' + URL_Helper.generateTokenLink(URL_Helper.generateQuery(Array.from(quizzerData.getConfigData().entries())))]);
                let candidateEmailAnchorElement = UI_Interface.createElements('a');
                UI_Interface.setAttributes([candidateEmailAnchorElement], ['href'], ['#']);
                UI_Interface.addEventListenerToElements([candidateEmailAnchorElement], ['click'], [function () { clipBoardObj.write(location.origin + '/quiz.html?' + URL_Helper.generateQuery(Array.from(quizzerData.getConfigData().entries()))) }])
                UI_Interface.attachElements(modalBodyElement, candidateEmailAnchorElement)
                UI_Interface.attachText([candidateEmailAnchorElement], [`Click to copy link for Candidate (${candidateEmail})`]);
            }
        }
        else { UI_Interface.attachText([modalBodyElement], ['You need to enter at least one candidate email']); }
    }
    ]
);
UI_Interface.addEventListenerToElements([UI_Interface.getElements('#newTestBtn')[0]], ['click'], [localDataPersistenceService.clear])
