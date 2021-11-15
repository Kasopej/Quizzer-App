import { quizzerLocalDataClass } from "../modules/AppLocalData/AppLocalData.js";
import UI_InterfaceClass from "../modules/UI/UI_Interface.js";
import { limitNumericalEntry } from "../modules/util/HandlersHelpers.js";
import { qtyOfQuestionsInCategoryURL } from "../modules/util/URL.js";
import { URL_HelperClass } from "../modules/util/URL_Helpers.js";
import API_ServiceClass from "../Services/API_Service.js";
import { LocalDataPersistenceClass } from "../Services/PersistentService.js";

const localDataPersistenceService = new LocalDataPersistenceClass();
const QuizzerLocalData = new quizzerLocalDataClass();
const UI_Interface = new UI_InterfaceClass();
const API_Service = new API_ServiceClass();
const localDataQuizzerConfigDataObj = localDataPersistenceService.getData('Quizzer Config Data')
let selectedCategoryName, selectedCategoryId;
const URL_Helper = new URL_HelperClass();


if (localDataQuizzerConfigDataObj) {
    Object.entries(localDataQuizzerConfigDataObj).forEach(entryArray => QuizzerLocalData.setConfigData(entryArray))
    selectedCategoryName = QuizzerLocalData.getConfigData('selectedCategoryName');
    selectedCategoryId = QuizzerLocalData.getConfigData('selectedCategoryId');
}
else { location.replace(location.origin) }

UI_Interface.attachText([UI_Interface.getElements('.language-specific-options fieldset legend')[0]], [selectedCategoryName + ' Quiz Setup']);
const qtyOfAvailableQuestionsInCategory = await API_Service.fetchData(qtyOfQuestionsInCategoryURL + selectedCategoryId).then(data => data.category_question_count.total_question_count);

const selectQuestionsQtyElement = UI_Interface.getElements('#questions-quantity')[0];
UI_Interface.addEventListenerToElements([selectQuestionsQtyElement], ['input'], [function () {
    limitNumericalEntry.call(this, qtyOfAvailableQuestionsInCategory, 'max')
}]
);

UI_Interface.addEventListenerToElements(Array.from(UI_Interface.getElements('[data-toggle = "modal"]')), ['click'],
    [function () {
        let [candidateName, numberOfQuestions] = UI_Interface.getInputValue([UI_Interface.getElements('#candidate-name')[0], selectQuestionsQtyElement]);
        if (candidateName) {
            QuizzerLocalData.setConfigData(['candidateName', candidateName], ['timing', this.innerText], ['numberOfQuestions', numberOfQuestions]);
            //UI_Interface.attachText(UI_Interface.getElements('#quiz-link-modal .modal-body p')[0], location.origin + '/quiz?' + URL_Helper.generateTokenLink(URL_Helper.generateQuery(Array.from(QuizzerLocalData.getConfigData().entries()))))
            UI_Interface.attachText([UI_Interface.getElements('#quiz-link-modal .modal-body p')[0]], [location.origin + '/quiz.html?' + URL_Helper.generateQuery(Array.from(QuizzerLocalData.getConfigData().entries()))]);
        }
    }]
)
