import RouterService from "../../Services/Router.js";
import UI_InterfaceClass from "../UI/UI_Interface.js";

export class AppDataOperationsClass {
    isDataAvailable(dataObject, getter, key) {
        let dataAvailable;
        return dataAvailable = (dataObject[getter](key) !== undefined) ? true : false;
    }
}
export class QuizzerDataOperationsClass extends AppDataOperationsClass {
    constructor(data) {
        super();
        this.data = data;
        this.UI_Interface = new UI_InterfaceClass();
        this.router = new RouterService();
        this.data.updateData(['scores', new Map()]);
        this.data.updateData(['selected options', new Map()]);
    }
    checkIfQuizIsTimed() {
        let timing = this.data.getConfigData('timing').slice(0, -7);
        return timing = (timing == 'Timed') ? true : false;
    }
    calcTotalTime() {
        const difficulty = this.data.getConfigData('selectedDifficulty');
        const quantity = this.data.getConfigData('numberOfQuestions');
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
        alert(`Dear ${candidateEmail}, you scored ${this.data.getData('total score')} / ${this.data.getData('questions data').length}`);
        this.router.redirect('quiz-finished.html')

    }
    filterCategories() {

    }
}