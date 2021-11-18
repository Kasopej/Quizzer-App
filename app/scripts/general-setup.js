import { QuizzerDataClass } from "../modules/AppData/AppData.js";
import UI_InterfaceClass from "../modules/UI/UI_Interface.js";
import { HandlerHelpersClass } from "../modules/util/Helpers.js";
import { CategoriesURL } from "../modules/util/URL.js";
import API_ServiceClass from "../Services/API_Service.js";
import { LocalDataPersistenceClass } from "../Services/PersistentService.js";
import RouterService from "../Services/Router.js";


const UI_Interface = new UI_InterfaceClass();
const API_Service = new API_ServiceClass();
const quizzerData = new QuizzerDataClass();
const selectElement = UI_Interface.getElements('#language-options')[0];
const localDataPersistenceService = new LocalDataPersistenceClass();
const Router = new RouterService();
const HandlerHelpers = new HandlerHelpersClass()

quizzerData.setData(['Quiz Categories', await API_Service.fetchData(CategoriesURL).then(data => data.trivia_categories)])
quizzerData.getData('Quiz Categories').forEach(categoryObj => {
    const optionElement = UI_Interface.createElements('option')
    UI_Interface.setAttributes([optionElement], ['value'], [categoryObj.id]);
    UI_Interface.attachText([optionElement], [categoryObj.name]);
    UI_Interface.attachElements(selectElement, optionElement);

})

function save_UI_Config_Entries(event) {
    const selectedCategoryElement = UI_Interface.getElements(`#language-options option:nth-of-type(${selectElement.selectedIndex + 1})`)[0];

    HandlerHelpers.saveEntries(quizzerData.setConfigData, 'selectedCategoryName', selectedCategoryElement.innerText);
    HandlerHelpers.saveEntries(quizzerData.setConfigData, 'selectedCategoryId', selectedCategoryElement.value);

    HandlerHelpers.saveEntries(quizzerData.setConfigData, 'selectedDifficulty', Array.from(UI_Interface.getElements("input[type = 'radio']")).find(radioElement => radioElement.checked)?.value);

    localDataPersistenceService.saveData('Quizzer Config Data', Object.fromEntries(quizzerData.getConfigData().entries()));
    Router.goToRoute(UI_Interface.getAttribute([this], 'href')[0])

    event.preventDefault()
}
UI_Interface.addEventListenerToElements([UI_Interface.getElements('#proceedBtn')[0]], ['click'], [save_UI_Config_Entries])


