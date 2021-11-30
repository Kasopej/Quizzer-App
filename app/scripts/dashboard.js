import UI_InterfaceClass from "../modules/UI/ui_Interface.js";
import { CategoriesURL } from "../modules/Util/url.js";
import API_ServiceClass from "../Services/apiService.js";

const ui_Interface = new UI_InterfaceClass();
const api_Service = new API_ServiceClass();

const categories = await api_Service.fetchData(CategoriesURL).then(data => data.trivia_categories);
console.log(categories);
const categoriesElementsArray = ui_Interface.createElements(...'tr '.repeat(categories.length).split(' ').slice(0, categories.length))
categoriesElementsArray.forEach(
    (categoryRowElement, index) => {
        ui_Interface.attachHTML([categoryRowElement], [`<td>${Date()}</td><td>${categories[index].name}</td><td>${categories[index].id}/10</td>`])
    }
)
ui_Interface.replaceChildren(ui_Interface.getElements('.table-light tbody')[0], categoriesElementsArray);