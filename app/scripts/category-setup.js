import { quizzerLocalDataClass } from "../modules/AppLocalData/AppLocalData.js";
import UI_InterfaceClass from "../modules/UI/UI_Interface.js";
import { limitNumericalEntry } from "../modules/util/HandlersHelpers.js";
import { qtyOfQuestionsInCategoryURL } from "../modules/util/URL.js";
import { URL_Generator_Helper } from "../modules/util/URL_Helpers.js";
import API_ServiceClass from "../Services/API_Service.js";
import { LocalDataPersistenceClass } from "../Services/PersistentService.js";

const localDataPersistenceService = new LocalDataPersistenceClass();
const QuizzerLocalData = new quizzerLocalDataClass();
const UI_Interface = new UI_InterfaceClass();
const API_Service = new API_ServiceClass();
const localDataQuizzerConfigDataObj = localDataPersistenceService.getData('Quizzer Config Data')
let selectedCategoryName, selectedCategoryId;
const URL_Generator = new URL_Generator_Helper();


if (localDataQuizzerConfigDataObj) {
    Object.entries(localDataQuizzerConfigDataObj).forEach(entryArray => QuizzerLocalData.setConfigData(entryArray))
    selectedCategoryName = QuizzerLocalData.getConfigData('Selected Category Name');
    selectedCategoryId = QuizzerLocalData.getConfigData('Selected Category Id');
}
else { location.replace(location.origin) }

UI_Interface.attachText(UI_Interface.getElements('.language-specific-options fieldset legend')[0], selectedCategoryName + ' Quiz Setup');
const qtyOfAvailableQuestionsInCategory = await API_Service.fetchData(qtyOfQuestionsInCategoryURL + selectedCategoryId).then(data => data.category_question_count.total_question_count);

const qtyOfQuestionsSelected = UI_Interface.getElements('#questions-quantity')[0];
UI_Interface.addEventListenerToElements(qtyOfQuestionsSelected, 'input', function () {
    limitNumericalEntry.call(this, qtyOfAvailableQuestionsInCategory, 'max')
});

UI_Interface.addEventListenerToElements(UI_Interface.getElements('[data-toggle = "modal"]')[0], 'click', function () {
    let candidateName = UI_Interface.getElements('#candidate-name')[0].value;
    if (candidateName) {
        QuizzerLocalData.setConfigData(['Candidate Name', candidateName], ['timing', this.innerText], ['Number of Questions', qtyOfQuestionsSelected.value])
        console.log(QuizzerLocalData.getConfigData());
        //UI_Interface.attachText(UI_Interface.getElements('#quiz-link-modal .modal-body p')[0], location.origin + '/quiz?' + URL_Generator.generateTokenLink(Object.fromEntries(QuizzerLocalData.getConfigData().entries())))
        UI_Interface.attachText(UI_Interface.getElements('#quiz-link-modal .modal-body p')[0], location.origin + '/quiz.html' + URL_Generator.generateDynamicQueryURL(Object.values(Object.fromEntries(QuizzerLocalData.getConfigData().entries()))))


    }
})
