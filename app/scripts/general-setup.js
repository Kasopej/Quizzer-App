import API_CallerClass from '../modules/API_Controllers.js'
import UI_ControllerClass from '../modules/UI_Controllers.js'
import setupDataControllerClass from '../modules/setupData.js'

const UI_Controller = new UI_ControllerClass();
const API_Caller = new API_CallerClass();
const selectElement = UI_Controller.getElements('#language-options')[0];
const setupDataController = new setupDataControllerClass();
const fetchBaseURL = 'https://opentdb.com/api_category.php';

API_Caller.getAllCategories(fetchBaseURL).then(categories => {
    categories.forEach((category) => {
        let optionElement = (UI_Controller.createElement('option'));
        UI_Controller.attachText(optionElement, category.name)
        UI_Controller.setAttributes(optionElement, 'value', category.id)
        UI_Controller.attachElements(selectElement, optionElement)
    })
})


let saveSelectedOptions = function (event) {
    const selectedCategoryElement = UI_Controller.getElements(`#language-options option:nth-of-type(${selectElement.selectedIndex + 1})`)[0]
    setupDataController.setConfigurationDataMap(
        ['category', selectedCategoryElement.innerText],
        ['difficulty', Array.from(UI_Controller.getElements("input[type = 'radio' ")).find(radioElement => {
            return radioElement.checked;
        })?.value], ['categoryID', selectedCategoryElement.value]
    )

    if (setupDataController.getConfigurationDataMap().get('category') && setupDataController.getConfigurationDataMap().get('difficulty')) {
        setupDataController.addToLocalStorage('storedConfigDataMap', Object.fromEntries(setupDataController.getConfigurationDataMap().entries()));
        location = location.origin + UI_Controller.getAttribute(this, 'href');
    }
    else {
        //Placeholder error log
        console.log('error, specify all fields!');
    }
    event.preventDefault();
}
UI_Controller.addEventListener(UI_Controller.getElements('#proceedBtn')[0], 'click', saveSelectedOptions)



