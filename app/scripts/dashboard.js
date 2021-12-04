import { resultData } from "../Data/resultsData.js";
import UI_InterfaceClass from "../modules/UI/ui_Interface.js";
import { HandlerHelpersClass, UI_CommandHelperClass } from "../modules/Util/helpers.js";
import { CategoriesURL } from "../modules/Util/url.js";
import API_ServiceClass from "../Services/apiService.js";

const ui_Interface = new UI_InterfaceClass();
const handlerHelper = new HandlerHelpersClass();
const ui_CommandHelper = new UI_CommandHelperClass();
//const api_Service = new API_ServiceClass();

//const categories = await api_Service.fetchData(CategoriesURL).then(data => data.trivia_categories);
const results = resultData
const resultsElementsArray = ui_Interface.createElements(...'tr '.repeat(results.length).split(' ').slice(0, results.length));
console.log(resultsElementsArray);
resultsElementsArray.forEach(
    (resultElement, index) => {
        let score = results[index].score.split('/');
        let percentScore = (score[0] / score[1]) * 100;
        let email = results[index].candidateEmail;
        ui_Interface.attachHTML([resultElement], [`<td class="time" data-timestamp="${new Date(results[index].timeStamp).valueOf()}">${new Date(results[index].timeStamp).toDateString()}</td><td>${email}</td><td class="score" data-score="${percentScore}">${percentScore}%</td>`])
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
console.log(resultsElementsArray);
ui_Interface.replaceChildren(ui_Interface.getElements('.table-light tbody')[0], resultsElementsArray);

const filterButtons = ui_Interface.getElements('.filter');
ui_Interface.addEventListenerToElements([ui_Interface.getElements('.sort-scores-ascending')[0], ui_Interface.getElements('.sort-scores-descending')[0]], ['click', 'click'], [sortDataByDate, sortDataByDateReverse]);
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
    handlerHelper.filterDataByRanges(resultsElementsArray,)
}

/*
function filterDateByRanges(dataArray = [], ranges = []) {
    let filteredDataArray = [];
    filteredDataArray = dataArray.filter(dataElement => {
        return dataElement.querySelectorAll('td')[0].dataset.timestamp >= ranges[0] && dataElement.querySelectorAll('td')[0].dataset.timestamp <= ranges[1]
    })
    ui_Interface.replaceChildren(ui_Interface.getElements('.table-light tbody')[0], filteredDataArray);
    return filteredDataArray;
}


function filterScoreByRanges(dataArray = [], ranges = []) {
    let filteredDataArray = [];
    filteredDataArray = dataArray.filter(dataElement => {
        return dataElement.querySelectorAll('.score')[0].innerText.slice(0, -1) >= ranges[0] && dataElement.querySelectorAll('.score')[0].innerText.slice(0, -1) <= ranges[1]
    })
    ui_Interface.replaceChildren(ui_Interface.getElements('.table-light tbody')[0], filteredDataArray);
    return filteredDataArray;
}
function filterDate() {
    filterDateByRanges(resultsElementsArray, [document.querySelector('.start-date').valueAsNumber, document.querySelector('.end-date').valueAsNumber])
}
function filterScore() {
    filterScoreByRanges(resultsElementsArray, [document.querySelector('.start-score').value, document.querySelector('.end-score').value])
}
*/





//const scoreRangeStart = prompt('Enter start of range', undefined);
//const scoreRangeEnd = prompt('Enter end of range', undefined);
function filterByScore() {
    const filteredResultsElementsArray = resultsElementsArray.filter(resultElement => {
        return resultElement.querySelector('.score').innerText.slice(0, -1) >= scoreRangeStart && resultElement.querySelector('.score').innerText.slice(0, -1) <= scoreRangeEnd;
    })
        (filteredResultsElementsArray.length) ? ui_Interface.replaceChildren(ui_Interface.getElements('.table-light tbody')[0], filteredResultsElementsArray) : ui_Interface.replaceChildren(ui_Interface.getElements('.table-light tbody')[0], resultsElementsArray);

}
//filterByScore();

const dateRangeStart = new Date('2011-11-07T14:48:00.000Z').valueOf();
const dateRangeEnd = new Date('2012-10-05T14:48:00.000Z').valueOf();
function filterByDate() {
    const filteredResultsElementsArray = resultsElementsArray.filter(resultElement => {
        return resultElement.querySelector('.time').dataset.timestamp >= dateRangeStart && resultElement.querySelector('.time').dataset.timestamp <= dateRangeEnd;
    })
    console.log(filteredResultsElementsArray);
    ui_Interface.replaceChildren(ui_Interface.getElements('.table-light tbody')[0], filteredResultsElementsArray);
}
//filterByDate();