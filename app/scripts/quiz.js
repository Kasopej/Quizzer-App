import UI_InterfaceClass from "../modules/UI/UI_Interface.js";
import { QuestionsURL } from "../modules/util/URL.js";
import { URL_HelperClass } from "../modules/util/URL_Helpers.js";
import API_ServiceClass from "../Services/API_Service.js";

const URL_Helper = new URL_HelperClass()
const API_Service = new API_ServiceClass()
const UI_Interface = new UI_InterfaceClass()

const params = URL_Helper.getParamsFromQueryString(location.search.substr(1))
const questions = await API_Service.fetchData(`${QuestionsURL}amount=${params.numberOfQuestions}&category=${params.selectedCategoryId}`).then(data => data.results)
let questionIndex = 0;


UI_Interface.attachText([UI_Interface.getElements('.card-text')[0]], [questions[questionIndex].question])


