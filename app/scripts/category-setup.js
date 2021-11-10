import setupDataClass from '../modules/setupData.js';
import API_CallerClass from '../modules/API_Controllers.js';
import UI_ControllerClass from '../modules/UI_Controllers.js';

const setupDataController = new setupDataClass();
const UI_Controller = new UI_ControllerClass();
const API_Caller = new API_CallerClass();
const numberInCategoryQueryURL = 'https://opentdb.com/api_count.php?category=';

UI_Controller.addEventListener(UI_Controller.getElements('#newTestBtn')[0], 'click', function () {
    setupDataController.clearLocalStorage()
});
function saveSelectedCategoryOptions() {
    setupDataController.setConfigurationDataMap(['candidateName', UI_Controller.getElements('#candidate-name')[0].value]);
    setupDataController.setConfigurationDataMap(['timing', this.innerText]);
    setupDataController.addToLocalStorage('storedConfigDataMap', Object.fromEntries(setupDataController.getConfigurationDataMap().entries()));
}
UI_Controller.addEventListener(Array.from(UI_Controller.getElements('[data-toggle="modal"]')), 'click', saveSelectedCategoryOptions);
const localStorageConfigDataMap = setupDataController.getFromLocalStorage('storedConfigDataMap');
if (localStorageConfigDataMap) {
    Object.entries(localStorageConfigDataMap).forEach(entry => { setupDataController.setConfigurationDataMap(entry) });
    const category = setupDataController.getConfigurationDataMap().get('category');
    const categoryID = setupDataController.getConfigurationDataMap().get('categoryID');

    UI_Controller.attachText(UI_Controller.getElements('.language-specific-options fieldset legend')[0], category + " Quiz Setup")

    API_Caller.numberOfQuestionsInCategory(numberInCategoryQueryURL, categoryID).then(questionsQuantity => {
        UI_Controller.setAttributes(UI_Controller.getElements('#questions-quantity')[0], 'max', questionsQuantity.total_question_count)
    })
}
else {
    alert('Test not configured! Setup general configurations first')
    location = location.origin;
}





