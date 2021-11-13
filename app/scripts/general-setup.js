import { quizzerLocalDataClass } from "../modules/AppLocalData/AppLocalData.js";
import UI_InterfaceClass from "../modules/UI/UI_Interface.js";
import { CategoriesURL } from "../modules/util/URL.js";
import API_ServiceClass from "../Services/API_Service.js";



const API_Service = new API_ServiceClass()
const QuizzerLocalData = new quizzerLocalDataClass()
QuizzerLocalData.setData(['Quiz Categories', await API_Service.fetchData(CategoriesURL)])
console.log(QuizzerLocalData.getData('Quiz Categories'));

const UI_Interface = new UI_InterfaceClass()
QuizzerLocalData.getData('Quiz Categories').forEach(categoryObj => {
    const optionElement = UI_Interface.createElements('option')
    UI_Interface.setAttributes([optionElement], ['value'], [categoryObj.id]);
    UI_Interface.attachText();
})


