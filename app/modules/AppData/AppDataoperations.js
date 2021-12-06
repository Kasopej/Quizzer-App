import API_ServiceClass from "../../Services/apiService.js";
import { LocalDataPersistenceClass } from "../../Services/persistentService.js";
import RouterService from "../../Services/router.js";
import UI_InterfaceClass from "../UI/ui_Interface.js";
import { globalQtyOfQuestionsURL, qtyOfQuestionsInCategoryURL } from "../Util/url.js";
const api_Service = new API_ServiceClass();

export class AppDataOperationsClass {
    isDataAvailable(dataObject, getter, key) {
        let dataAvailable;
        dataAvailable = dataObject[getter](key);
        if (Array.isArray(dataAvailable)) {
            return dataAvailable = (dataObject[getter](key).length) ? true : false;
        }

    }
}
export class QuizzerDataOperationsClass extends AppDataOperationsClass {
    constructor(data) {
        super();
        this.data = data;
        this.UI_Interface = new UI_InterfaceClass();
        this.localDataService = new LocalDataPersistenceClass()
        this.router = new RouterService();
        this.data.updateData(['scores', new Map()]);
        this.data.updateData(['selected options', new Map()]);
    }
    async qtyOfQuestionsAvailable(categoryId, difficulty) {
        if (!(+categoryId)) {
            this.data.updateData(['globalQtyOfAvailableQuestions', await api_Service.fetchData(globalQtyOfQuestionsURL).then(data => data.overall.total_num_of_verified_questions)]);
            return this.data.getData('globalQtyOfAvailableQuestions');
        }
        this.data.updateData(['availableQuestionsInCategory', await api_Service.fetchData(qtyOfQuestionsInCategoryURL + categoryId).then(data => data.category_question_count)]);
        switch (difficulty) {
            case 'easy':
                return this.data.getData('availableQuestionsInCategory').total_easy_question_count;
            case 'medium':
                return this.data.getData('availableQuestionsInCategory').total_medium_question_count;
            case 'hard':
                return this.data.getData('availableQuestionsInCategory').total_hard_question_count;
            default:
                return this.data.getData('availableQuestionsInCategory').total_question_count
        }
    }
    checkIfQuizIsTimed() {
        let timing = this.data.getConfigData('timing').slice(0, -7);
        return timing = (timing == 'Timed') ? true : false;
    }
    calcTotalTime() {
        const difficulty = this.data.getConfigData('difficulty');
        const quantity = this.data.getConfigData('amount');
        switch (difficulty) {
            case 'easy':
                this._totalTime = quantity * 10;
                break;
            case 'medium':
                this._totalTime = quantity * 20;
                break;
            case 'hard':
                this._totalTime = quantity * 30;
                break;
            default:
                this._totalTime = quantity * 20;
                //Implement default timing
                break;
        }
    }
    updateAndRenderTimeLeft(element) {
        let timerId = setInterval(() => {
            --this._totalTime;
            let minutes = Math.floor(this._totalTime / 60);
            let seconds = this._totalTime - (minutes * 60);
            let colorClasses = ['black-text', 'red-text',]
            let selectedIndex = Math.floor(Math.random() * 2);
            let unselectedIndex = (selectedIndex == 0) ? 1 : 0;
            this.UI_Interface.attachText([element], [`${minutes}m : ${seconds}s`]);
            this.UI_Interface.replaceClassOnElements([element], [colorClasses[unselectedIndex], colorClasses[selectedIndex]]);
            if (this._totalTime == 0) {
                clearInterval(timerId);
                this.calculateScoresAndEndQuiz();
            }
        }, 1000)
    }
    checkAnswer(selectedOption, questionId) {
        if (selectedOption == this.data.getData('questions data')[questionId].answerId) {
            let score = 1;
            this.data.getData('selected options').set(questionId, selectedOption - 1);
            this.data.getData('scores').set(questionId, score);
            return;
        }
        let score = 0;
        this.data.getData('selected options').set(questionId, selectedOption - 1);
        this.data.getData('scores').set(questionId, score);
    }
    getAnswer() {

    }
    getCategories() {

    }
    calculateScoresAndEndQuiz() {
        let totalScore = Array.from(this.data.getData('scores').values()).reduce((a, b) => { return a + b }, 0);
        let candidateEmail = this.data.getConfigData('candidateEmail').replace('%20', ' ');
        this.data.updateData(['total score', totalScore]);
        if (!this.localDataService.getData('resultsData')) {
            this.localDataService.saveData('resultsData', [])
        }
        let resultsArray = this.localDataService.getData('resultsData');
        resultsArray.push({ 'candidateEmail': candidateEmail, 'timeStamp': new Date().valueOf(), 'score': `${this.data.getData('total score')}/${this.data.getData('questions data').length}` });
        this.localDataService.saveData('resultsData', resultsArray);
        alert(`Dear ${candidateEmail}, you scored ${this.data.getData('total score')} / ${this.data.getData('questions data').length}`);
        this.router.redirect('quiz-finished.html')

    }
    filterCategories() {

    }
}