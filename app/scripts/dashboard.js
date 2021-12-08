import UI_InterfaceClass from "../modules/UI/ui_Interface.js";
import { HandlerHelpersClass, UI_CommandHelperClass } from "../modules/Util/helpers.js";
import { CategoriesURL } from "../modules/Util/url.js";
import API_ServiceClass from "../Services/apiService.js";
import { LocalDataPersistenceClass } from "../Services/persistentService.js";

const ui_Interface = new UI_InterfaceClass();
const handlerHelper = new HandlerHelpersClass();
const ui_CommandHelper = new UI_CommandHelperClass();
//const api_Service = new API_ServiceClass();
const LocalDataPersistenceService = new LocalDataPersistenceClass()


//const categories = await api_Service.fetchData(CategoriesURL).then(data => data.trivia_categories);
const results = LocalDataPersistenceService.getData('resultsData');
let resultsElementsArray = ui_Interface.createElements(...'tr '.repeat(results.length).split(' ').slice(0, results.length));
if (!Array.isArray(resultsElementsArray)) {
    resultsElementsArray = [resultsElementsArray]
}
const isFiltered = new Set();
let filteredResultsElementsArray = [];
const dateInputs = ui_Interface.getElements('#dateModal input');
const scoreInputs = ui_Interface.getElements('#scoreModal input');
resultsElementsArray.forEach(
    (resultElement, index) => {
        let score = results[index].score.split('/');
        let percentScore = (score[0] / score[1]) * 100;
        let email = results[index].candidateEmail;
        ui_Interface.attachHTML([resultElement], [`<td class="time" data-timestamp="${new Date(results[index].timeStamp)}">${new Date(results[index].timeStamp).toDateString()}</td><td>${email}</td><td class="score" data-score="${percentScore}">${percentScore}%</td>`])
        if (resultElement.querySelector('.score').innerText.slice(0, -1) >= 50) {
            resultElement.querySelector('.score').classList.add('goodResult')
        }
        else {
            resultElement.querySelector('.score').classList.add('badResult')
        }
    }
);
resultsElementsArray.sort((a, b) => {
    return +a.querySelectorAll('td')[0].dataset.timestamp - +b.querySelectorAll('td')[0].dataset.timestamp
});
filteredResultsElementsArray = cloneResultsElementsArray(filteredResultsElementsArray);
ui_Interface.replaceChildren(ui_Interface.getElements('.table-light tbody')[0], resultsElementsArray);

const filterButtons = ui_Interface.getElements('.filter');
ui_Interface.addEventListenerToElements([ui_Interface.getElements('.sort-scores-ascending')[0], ui_Interface.getElements('.sort-scores-descending')[0]], ['click', 'click'], [sortDataByDate, sortDataByDateReverse]);
ui_Interface.addEventListenerToElements(scoreInputs, ['change'], [function () {
    handlerHelper.limitNumericalEntry.call(this, [100, 0], ['max', 'min'])
}])
ui_Interface.addEventListenerToElements(Array.from(filterButtons), ['click'], [filterData])

function sortDataByDate() {
    ui_Interface.sortData(resultsElementsArray, 'score', true, '.score', false);
    ui_Interface.replaceChildren(ui_Interface.getElements('.table-light tbody')[0], resultsElementsArray);
}
function sortDataByDateReverse() {
    ui_Interface.sortData(resultsElementsArray, 'score', true, '.score', true);
    ui_Interface.replaceChildren(ui_Interface.getElements('.table-light tbody')[0], resultsElementsArray);
}
function filterData() {
    let basis = []; let ranges = []; let childSelectors = [];
    if (isFiltered.has(this.id)) { filteredResultsElementsArray = cloneResultsElementsArray(filteredResultsElementsArray); }
    switch (this.id) {
        case 'score':
            basis = ['score', 'timestamp'];
            ranges = [ui_Interface.getInputValue(scoreInputs), ui_Interface.getInputValue(dateInputs)];
            childSelectors = ['.score', '.time'];
            break;
        case 'time':
            basis = ['timestamp', 'score'];
            ranges = [ui_Interface.getInputValue(dateInputs), ui_Interface.getInputValue(scoreInputs)];
            childSelectors = ['.time', '.score'];
            break;
        default:
            break;
    }
    ranges = ranges.filter(range => {
        let invalidInput;
        for (let value of range) {
            if (value === '' || value !== value) {
                invalidInput = true;
            }
        }
        if (!invalidInput) return true;
    })
    ui_Interface.filterData(filteredResultsElementsArray, basis, true, childSelectors, ranges);
    ui_Interface.replaceChildren(ui_Interface.getElements('.table-light tbody')[0], filteredResultsElementsArray);
    isFiltered.add(this.id);
}
function cloneResultsElementsArray(cloneTarget) {
    return cloneTarget = [...resultsElementsArray]
}