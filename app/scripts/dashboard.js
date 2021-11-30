import { resultData } from "../Data/resultsData.js";
import UI_InterfaceClass from "../modules/UI/ui_Interface.js";
import { CategoriesURL } from "../modules/Util/url.js";
import API_ServiceClass from "../Services/apiService.js";

const ui_Interface = new UI_InterfaceClass();
//const api_Service = new API_ServiceClass();

//const categories = await api_Service.fetchData(CategoriesURL).then(data => data.trivia_categories);
const categories = resultData
console.log(categories);
const categoriesElementsArray = ui_Interface.createElements(...'tr '.repeat(categories.length).split(' ').slice(0, categories.length))
categoriesElementsArray.forEach(
    (categoryRowElement, index) => {
        ui_Interface.attachHTML([categoryRowElement], [`<td data-timestamp="${new Date(categories[index].timeStamp).valueOf()}">${new Date(categories[index].timeStamp).toDateString()}</td><td>${categories[index].candidateEmail}</td><td>${categories[index].score}</td>`])
    }
)
categoriesElementsArray.sort((a, b) => {
    return +a.querySelectorAll('td')[0].dataset.timestamp - +b.querySelectorAll('td')[0].dataset.timestamp
})
ui_Interface.replaceChildren(ui_Interface.getElements('.table-light tbody')[0], categoriesElementsArray);