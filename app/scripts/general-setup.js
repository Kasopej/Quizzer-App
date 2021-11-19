import { QuizzerDataClass } from "../modules/AppData/AppData.js";
import { QuizzerDataOperationsClass } from "../modules/AppData/AppDataoperations.js";
import UI_InterfaceClass from "../modules/UI/UI_Interface.js";
import { HandlerHelpersClass } from "../modules/util/Helpers.js";
import { CategoriesURL } from "../modules/util/URL.js";
import API_ServiceClass from "../Services/API_Service.js";
import { LocalDataPersistenceClass } from "../Services/PersistentService.js";
import RouterService from "../Services/Router.js";


const UI_Interface = new UI_InterfaceClass();
const API_Service = new API_ServiceClass();
const quizzerData = new QuizzerDataClass();
const selectElement = UI_Interface.getElements('#category-options')[0];
const localDataPersistenceService = new LocalDataPersistenceClass();
const router = new RouterService();
const handlerHelpers = new HandlerHelpersClass();
const quizzerDataOperation = new QuizzerDataOperationsClass(quizzerData);

quizzerData.setData(['Quiz Categories', await API_Service.fetchData(CategoriesURL).then(data => data.trivia_categories)])
quizzerData.getData('Quiz Categories').forEach(categoryObj => {
    const optionElement = UI_Interface.createElements('option')
    UI_Interface.setAttributes([optionElement], ['value'], [categoryObj.id]);
    UI_Interface.attachText([optionElement], [categoryObj.name]);
    UI_Interface.attachElements(selectElement, optionElement);
})
if (quizzerDataOperation.isDataAvailable(quizzerData, 'getData', 'Quiz Categories')) { UI_Interface.removeElement(UI_Interface.getElements('.category-options-spinner')[0]) }

function save_UI_Config_Entries(event) {
    if (selectElement.selectedIndex) {
        const selectedCategoryElement = UI_Interface.getElements(`#category-options option:nth-of-type(${selectElement.selectedIndex + 1})`)[0];

        handlerHelpers.saveEntries(quizzerData.setConfigData, 'selectedCategoryName', selectedCategoryElement.innerText);
        handlerHelpers.saveEntries(quizzerData.setConfigData, 'selectedCategoryId', selectedCategoryElement.value);

        handlerHelpers.saveEntries(quizzerData.setConfigData, 'selectedDifficulty', Array.from(UI_Interface.getElements("input[type = 'radio']")).find(radioElement => radioElement.checked)?.value);

        localDataPersistenceService.saveData('Quizzer Config Data', Object.fromEntries(quizzerData.getConfigData().entries()));
        router.goToRoute(UI_Interface.getAttributeFromElements([this], 'href')[0])
    }
    event.preventDefault()
}
UI_Interface.addEventListenerToElements([UI_Interface.getElements('#proceed-btn')[0]], ['click'], [save_UI_Config_Entries])


