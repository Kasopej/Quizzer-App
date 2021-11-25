import { QuizzerDataClass } from "../modules/AppData/AppData.js";
import { QuizzerDataOperationsClass } from "../modules/AppData/AppDataoperations.js";
import UI_InterfaceClass from "../modules/UI/UI_Interface.js";
import { HandlerHelpersClass, URL_HelperClass } from "../modules/util/Helpers.js";
import { CategoriesURL, quizPageRelativePath } from "../modules/util/URL.js";
import API_ServiceClass from "../Services/API_Service.js";
import RouterService from "../Services/Router.js";
import { ClipboardClass } from "../Services/UserAgent.js";


const UI_Interface = new UI_InterfaceClass();
const API_Service = new API_ServiceClass();
const quizzerData = new QuizzerDataClass();
const quizzerDataOperation = new QuizzerDataOperationsClass(quizzerData);
const router = new RouterService();
const handlerHelpers = new HandlerHelpersClass();
const URL_Helper = new URL_HelperClass();
const clipBoardObj = new ClipboardClass();
const questionQtyElement = UI_Interface.getElements('#amountOfQuestions')[0];
const selectCategoryElement = UI_Interface.getElements('#categorySelect')[0];
const selectDifficultyElement = UI_Interface.getElements('#difficultySelect')[0];
const selectTypeElement = UI_Interface.getElements('#typeSelect')[0];
const selectTimingElement = UI_Interface.getElements('#timingSelect')[0];
const typeOptionElements = Array.from(UI_Interface.getElements('#typeSelect option'));
const timingOptionElements = Array.from(UI_Interface.getElements('#timingSelect option'));
const submitButtonElement = UI_Interface.getElements('#submitBtn')[0];
const difficultyOptionElements = Array.from(UI_Interface.getElements('#difficultySelect option'));



quizzerData.updateData(['Quiz Categories', await API_Service.fetchData(CategoriesURL).then(data => data.trivia_categories)])
quizzerData.getData('Quiz Categories').forEach(categoryObj => {
    const optionElement = UI_Interface.createElements('option')
    UI_Interface.setAttributes([optionElement], ['value'], [categoryObj.id]);
    UI_Interface.attachText([optionElement], [categoryObj.name]);
    UI_Interface.attachElements(selectCategoryElement, optionElement);
})
const categoryOptionElements = Array.from(UI_Interface.getElements('#categorySelect option'));
if (quizzerDataOperation.isDataAvailable(quizzerData, 'getData', 'Quiz Categories')) {
    UI_Interface.removeElement(UI_Interface.getElements('.category-options-spinner')[0])
}
function checkAndValidateQuantityInput() {
    UI_Interface.setAttributes([submitButtonElement], ['disabled'], ['']);
    quizzerDataOperation.qtyOfQuestionsAvailable(categoryOptionElements[selectCategoryElement.selectedIndex].value, difficultyOptionElements[selectDifficultyElement.selectedIndex].value).then(quantity => {
        console.log(quantity);
        UI_Interface.attachText([UI_Interface.getElements('.questionQuantityGroup .valid-feedback')[0]], [`Number of questions available: ${quantity}`]);
        quizzerData.updateConfigData(['numberOfQuestionsAvailableInSelection', quantity]);
        validateQuantityInput();
        UI_Interface.removeAttributes([submitButtonElement], ['disabled'])
    })
}
function validateQuantityInput() {
    handlerHelpers.limitNumericalEntry.call(questionQtyElement, [quizzerData.getConfigData('numberOfQuestionsAvailableInSelection'), 1], ['max', 'min']);
}

function save_UI_Config_Entries(event) {
    const selectedCategoryOptionElement = categoryOptionElements[selectCategoryElement.selectedIndex];
    const selectedDifficultyOptionElement = difficultyOptionElements[selectDifficultyElement.selectedIndex];
    const selectedTypeOptionElement = typeOptionElements[selectTypeElement.selectedIndex];
    const selectedTimingOptionElement = timingOptionElements[selectTimingElement.selectedIndex]
    let [candidatesEmails, numberOfQuestions] = UI_Interface.getInputValue([UI_Interface.getElements('#candidatesEmails')[0], questionQtyElement]);
    //Maybe use getInputValue method
    quizzerData.updateConfigData(['amount', numberOfQuestions]);
    handlerHelpers.helpSaveData(quizzerData.updateConfigData, 'categoryName', selectedCategoryOptionElement.innerText);
    handlerHelpers.helpSaveData(quizzerData.updateConfigData, 'category', selectedCategoryOptionElement.value);
    handlerHelpers.helpSaveData(quizzerData.updateConfigData, 'difficulty', selectedDifficultyOptionElement.value);
    handlerHelpers.helpSaveData(quizzerData.updateConfigData, 'type', selectedTypeOptionElement.value);
    handlerHelpers.helpSaveData(quizzerData.updateConfigData, 'timing', selectedTimingOptionElement.value);
    processEmailEntries(candidatesEmails);
    event.preventDefault()
}

function processEmailEntries(candidatesEmails) {
    console.log(candidatesEmails);
    const modalBodyElement = UI_Interface.getElements('#quiz-link-modal p')[0];
    UI_Interface.replaceHTML([modalBodyElement], ['']);

    candidatesEmails = candidatesEmails.trim();
    const candidatesEmailsArray = candidatesEmails.split(',');
    let invalidEmail = candidatesEmailsArray.find(email => !email.includes('@') || !email.includes('.') || email.includes('@.') || email.startsWith('@'));

    if (candidatesEmails && !invalidEmail) {
        let emailsValidated;
        for (let candidateEmail of candidatesEmailsArray) {
            candidateEmail = candidateEmail.trim()
            if (candidateEmail !== "" && !candidateEmail.includes(' ')) {
                emailsValidated = true;
                quizzerData.updateConfigData(['candidateEmail', candidateEmail]);
                //UI_Interface.attachText([modalBodyElement], [location.origin + '/quiz?' + URL_Helper.generateTokenLink(URL_Helper.generateQuery(Array.from(quizzerData.getConfigData().entries())))]);
                let candidateEmailAnchorElement = UI_Interface.createElements('a');
                UI_Interface.setAttributes([candidateEmailAnchorElement], ['href'], ['#']);

                UI_Interface.addEventListenerToElements([candidateEmailAnchorElement], ['click'], [function () { clipBoardObj.write(location.origin + quizPageRelativePath + URL_Helper.generateQuery(Array.from(Object.entries(quizzerData.getConfigData())), true)) }
                ]);

                /*
                UI_Interface.addEventListenerToElements([candidateEmailAnchorElement], ['click'], [function () { clipBoardObj.write(location.origin + quizPageRelativePath + URL_Helper.generateTokenLink(URL_Helper.generateQuery(Array.from(Object.entries(quizzerData.getConfigData())), true))) }
                ]);
                */

                UI_Interface.attachText([candidateEmailAnchorElement], [`Click to copy link for Candidate (${candidateEmail})`]);
                UI_Interface.attachElements(modalBodyElement, candidateEmailAnchorElement)
            }
        }
        console.log(quizzerData.getConfigData());
        if (emailsValidated) {
            UI_Interface.removeClassFromElements([UI_Interface.getElements('#candidatesEmails')[0]], 'is-invalid');
            return;
        }
    }
    UI_Interface.attachText([modalBodyElement], ['Invalid entry, please enter one or more comma separated email addresses']);
    UI_Interface.addClassToElements([UI_Interface.getElements('#candidatesEmails')[0]], 'is-invalid');
}


UI_Interface.addEventListenerToElements([submitButtonElement, questionQtyElement, selectCategoryElement, selectDifficultyElement], ['click', 'input', 'change'], [save_UI_Config_Entries, validateQuantityInput, checkAndValidateQuantityInput])
checkAndValidateQuantityInput();


