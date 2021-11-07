import API_CallerClass from './API_Controllers.js'
import UI_ControllerClass from './UI_Controllers.js'
const UI_Controller = new UI_ControllerClass();
const API_Caller = new API_CallerClass();

API_Caller.getAllCategories().then(categories => {
    categories.forEach((category) => {
        let optionElement = (UI_Controller.createElement('option'));
        UI_Controller.attachText(optionElement, category.name)
        UI_Controller.setAttributes(optionElement, 'value', category.name)
        UI_Controller.attachElements(UI_Controller.getElenents('#language-options')[0], optionElement)
    })

})



