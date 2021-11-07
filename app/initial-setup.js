import API_CallerClass from './API_Controllers.js'
import UI_ControllerClass from './UI_Controllers.js'
import setupDataControllerClass from './setupData.js'

const UI_Controller = new UI_ControllerClass();
const API_Caller = new API_CallerClass();
const selectElement = UI_Controller.getElenents('#language-options')[0];
const setupDataController = new setupDataControllerClass()

API_Caller.getAllCategories().then(categories => {
    categories.forEach((category) => {
        let optionElement = (UI_Controller.createElement('option'));
        UI_Controller.attachText(optionElement, category.name)
        UI_Controller.setAttributes(optionElement, 'value', category.name)
        UI_Controller.attachElements(selectElement, optionElement)
    })
})

let saveSelectedOptions = function () {
    const configDataMap = setupDataController.configurationDataMap;
    configDataMap.set('category', UI_Controller.getElenents(`#language-options option:nth-of-type(${selectElement.selectedIndex + 1})`)[0].innerText)
        .set('difficulty', Array.from(UI_Controller.getElenents("input[type = 'radio' ")).find(radioElement => {
            return radioElement.checked;
        })?.value)

    setupDataController.addToLocalStorage('storedConfigDataMap', Object.fromEntries(configDataMap.entries()))
    location = location.origin + UI_Controller.getAttribute(this, 'href');
}
UI_Controller.addEventListener(UI_Controller.getElenents('#proceedBtn')[0], 'click', saveSelectedOptions)



