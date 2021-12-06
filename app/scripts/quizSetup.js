import { QuizzerDataClass } from "../Modules/AppData/appData.js";
import { QuizzerDataOperationsClass } from "../Modules/AppData/appDataOperations.js";
import UI_InterfaceClass from "../Modules/UI/ui_Interface.js";
import { HandlerHelpersClass, URL_HelperClass } from "../Modules/Util/helpers.js";
import { CategoriesURL, quizPageRelativePath } from "../Modules/Util/url.js";
import API_ServiceClass from "../Services/apiService.js";
import { ClipboardClass } from "../Services/userAgent.js";

// Instantiate business logic classes
const ui_Interface = new UI_InterfaceClass();
const API_Service = new API_ServiceClass();
const quizzerData = new QuizzerDataClass();
const quizzerDataOperation = new QuizzerDataOperationsClass(quizzerData);
const handlerHelpers = new HandlerHelpersClass();
const URL_Helper = new URL_HelperClass();
const clipBoardObj = new ClipboardClass();

// Import node objects from DOM
const questionQtyElement = ui_Interface.getElements('#amountOfQuestions')[0];
const selectCategoryElement = ui_Interface.getElements('#categorySelect')[0];
const selectDifficultyElement = ui_Interface.getElements('#difficultySelect')[0];
const selectTypeElement = ui_Interface.getElements('#typeSelect')[0];
const selectTimingElement = ui_Interface.getElements('#timingSelect')[0];
const typeOptionElements = Array.from(ui_Interface.getElements('#typeSelect option'));
const timingOptionElements = Array.from(ui_Interface.getElements('#timingSelect option'));
const submitButtonElement = ui_Interface.getElements('#submitBtn')[0];
const difficultyOptionElements = Array.from(ui_Interface.getElements('#difficultySelect option'));
const testExpirationDateElement = ui_Interface.getElements('#expiryDate')[0];


//Make call for categories and attach them to category form element
quizzerData.updateData(['Quiz Categories', await API_Service.fetchData(CategoriesURL).then(data => data.trivia_categories)])
quizzerData.getData('Quiz Categories').forEach(categoryObj => {
    const optionElement = ui_Interface.createElements('option')
    ui_Interface.setAttributes([optionElement], ['value'], [categoryObj.id]);
    ui_Interface.attachText([optionElement], [categoryObj.name]);
    ui_Interface.attachElements(selectCategoryElement, optionElement);
})
const categoryOptionElements = Array.from(ui_Interface.getElements('#categorySelect option'));

if (quizzerDataOperation.isDataAvailable(quizzerData, 'getData', 'Quiz Categories')) { //Checks if categories have been successfully saved in app. Returns boolean
    ui_Interface.removeElement(ui_Interface.getElements('.category-options-spinner')[0])
}
function checkAndValidateQuantityInput() { //Checks number of questions available based on current form selection. Prevents submission while checking
    ui_Interface.setAttributes([submitButtonElement], ['disabled'], ['']);
    quizzerDataOperation.qtyOfQuestionsAvailable(categoryOptionElements[selectCategoryElement.selectedIndex].value, difficultyOptionElements[selectDifficultyElement.selectedIndex].value).then(quantity => {
        ui_Interface.attachText([ui_Interface.getElements('.questionQuantityGroup .valid-feedback')[0]], [`Number of questions available: ${quantity}`]);
        quizzerData.updateConfigData(['numberOfQuestionsAvailableInSelection', quantity]);
        validateQuantityInput();
        ui_Interface.removeAttributes([submitButtonElement], ['disabled'])
    })
}
function validateQuantityInput() { //Prevent user from exceeding limits for available number of questions
    handlerHelpers.limitNumericalEntry.call(questionQtyElement, [quizzerData.getConfigData('numberOfQuestionsAvailableInSelection'), 1], ['max', 'min']);
}

function save_UI_Config_Entries(event) { //On form submit, save form selections to configData
    const selectedCategoryOptionElement = categoryOptionElements[selectCategoryElement.selectedIndex];
    const selectedDifficultyOptionElement = difficultyOptionElements[selectDifficultyElement.selectedIndex];
    const selectedTypeOptionElement = typeOptionElements[selectTypeElement.selectedIndex];
    const selectedTimingOptionElement = timingOptionElements[selectTimingElement.selectedIndex]
    let [candidatesEmails, numberOfQuestions] = ui_Interface.getInputValue([ui_Interface.getElements('#candidatesEmails')[0], questionQtyElement]);
    quizzerData.updateConfigData(['amount', numberOfQuestions]);
    handlerHelpers.helpSaveData(quizzerData.updateConfigData, 'categoryName', selectedCategoryOptionElement.innerText);
    handlerHelpers.helpSaveData(quizzerData.updateConfigData, 'category', selectedCategoryOptionElement.value);
    handlerHelpers.helpSaveData(quizzerData.updateConfigData, 'difficulty', selectedDifficultyOptionElement.value);
    handlerHelpers.helpSaveData(quizzerData.updateConfigData, 'type', selectedTypeOptionElement.value);
    handlerHelpers.helpSaveData(quizzerData.updateConfigData, 'timing', selectedTimingOptionElement.value);
    handlerHelpers.helpSaveData(quizzerData.updateConfigData, 'expiryDate', testExpirationDateElement.valueAsNumber);
    processEmailEntries(candidatesEmails);
    event.preventDefault()
}

function processEmailEntries(candidatesEmails) { //Validate emails and print links (if emails valid). Copy configuration data to each email link
    const modalBodyElement = ui_Interface.getElements('#quiz-link-modal p')[0];
    ui_Interface.replaceHTML([modalBodyElement], ['']);

    candidatesEmails = candidatesEmails.trim();
    const candidatesEmailsArray = candidatesEmails.split(',');
    let invalidEmail = candidatesEmailsArray.find(email => !email.includes('@') || !email.includes('.') || email.includes('@.') || email.startsWith('@'));

    if (candidatesEmails && !invalidEmail) {
        let emailsValidated; let index = 0;
        for (let candidateEmail of candidatesEmailsArray) {
            candidateEmail = candidateEmail.trim();
            if (candidateEmail !== "" && !candidateEmail.includes(' ')) {
                emailsValidated = true;
                quizzerData.updateConfigData(['candidateEmail', candidateEmail]);
                //ui_Interface.attachText([modalBodyElement], [location.origin + '/quiz?' + URL_Helper.generateTokenLink(URL_Helper.generateQuery(Array.from(quizzerData.getConfigData().entries())))]);
                let candidateEmailAnchorElement = ui_Interface.createElements('a');
                ui_Interface.setAttributes([candidateEmailAnchorElement], ['href', 'id'], ['#', index]);
                quizzerData.mapConfigDataClone(index);
                ui_Interface.addEventListenerToElements([candidateEmailAnchorElement], ['click'], [function (e) {
                    clipBoardObj.write(location.origin + quizPageRelativePath + URL_Helper.generateQuery(Array.from(Object.entries(quizzerData.getConfigDataClone(+this.id))), true))
                }
                ]);

                /*
                ui_Interface.addEventListenerToElements([candidateEmailAnchorElement], ['click'], [function () { clipBoardObj.write(location.origin + quizPageRelativePath + URL_Helper.generateTokenLink(URL_Helper.generateQuery(Array.from(Object.entries(quizzerData.getConfigData())), true))) }
                ]);
                */
                index++;
                ui_Interface.attachText([candidateEmailAnchorElement], [`Click to copy link for Candidate (${candidateEmail})`]);
                ui_Interface.attachElements(modalBodyElement, candidateEmailAnchorElement)
            }
        }
        if (emailsValidated) {
            ui_Interface.removeClassFromElements([ui_Interface.getElements('#candidatesEmails')[0]], 'is-invalid');
            return;
        }
    }
    ui_Interface.attachText([modalBodyElement], ['Invalid entry, please enter one or more comma separated email addresses']);
    ui_Interface.addClassToElements([ui_Interface.getElements('#candidatesEmails')[0]], 'is-invalid');
}


ui_Interface.addEventListenerToElements([submitButtonElement, questionQtyElement, selectCategoryElement, selectDifficultyElement], ['click', 'input', 'change'], [save_UI_Config_Entries, validateQuantityInput, checkAndValidateQuantityInput])
checkAndValidateQuantityInput();