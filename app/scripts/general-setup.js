import { quizzerLocalDataClass } from "../modules/AppLocalData/AppLocalData.js";
import UI_InterfaceClass from "../modules/UI/UI_Interface.js";
import { save_UI_Entries } from "../modules/util/Handlers.js";
import { CategoriesURL } from "../modules/util/URL.js";
import API_ServiceClass from "../Services/API_Service.js";
import { LocalDataPersistenceClass } from "../Services/PersistentService.js";


const UI_Interface = new UI_InterfaceClass();
const API_Service = new API_ServiceClass();
const QuizzerLocalData = new quizzerLocalDataClass();
const selectElement = UI_Interface.getElements('#language-options')[0];
const localDataPersistenceService = new LocalDataPersistenceClass();

QuizzerLocalData.setData(['Quiz Categories', await API_Service.fetchData(CategoriesURL)])
QuizzerLocalData.getData('Quiz Categories').forEach(categoryObj => {
    const optionElement = UI_Interface.createElements('option')
    UI_Interface.setAttributes([optionElement], ['value'], [categoryObj.id]);
    UI_Interface.attachText(optionElement, categoryObj.name);
    UI_Interface.attachElements(selectElement, optionElement);

})

function save_UI_Config_Entries(event) {
    const selectedCategoryElement = UI_Interface.getElements(`#language-options option:nth-of-type(${selectElement.selectedIndex + 1})`)[0];

    save_UI_Entries(QuizzerLocalData.setConfigData, 'Selected Category Name', selectedCategoryElement.innerText);
    save_UI_Entries(QuizzerLocalData.setConfigData, 'Selected Category Id', selectedCategoryElement.value);

    save_UI_Entries(QuizzerLocalData.setConfigData, 'Selected Difficulty', Array.from(UI_Interface.getElements("input[type = 'radio']")).find(radioElement => radioElement.checked)?.value);

    localDataPersistenceService.saveToLocalData('Quizzer Config Data', QuizzerLocalData.getConfigData())

    event.preventDefault()
}
UI_Interface.addEventListenerToElements(UI_Interface.getElements('#proceedBtn')[0], 'click', save_UI_Config_Entries)


