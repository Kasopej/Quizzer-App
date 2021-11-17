import RouterService from "../../Services/Router.js";
import UI_InterfaceClass from "../UI/UI_Interface.js";

export class AppDataOperationsClass {

}
export class QuizzerDataOperationsClass extends AppDataOperationsClass {
    constructor(data) {
        super();
        this.data = data;
        this.UI_Interface = new UI_InterfaceClass();
        this.router = new RouterService();
        this.data.setData(['scores', new Map()]);
        this.data.setData(['selected options', new Map()]);
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
            case 'medium':
                this._totalTime = quantity * 30;
                break;
            default:
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
            this.UI_Interface.replacedClassOnElements([element], [colorClasses[unselectedIndex], colorClasses[selectedIndex]]);
            if (this._totalTime == 0) {
                clearInterval(timerId);
                this.calculateScores();
            }
        }, 1000)
    }
    checkAnswer(selectedOption, questionId) {
        console.log('Logging selected');
        if (selectedOption == this.data.getData('questions data')[questionId].answerId) {
            let score = 1;
            this.data.getData('selected options').set(questionId, selectedOption - 1);
            this.data.getData('scores').set(questionId, score);
            console.log('selected option: ' + this.data.getData('selected options').get(questionId));
            return;
        }
        let score = 0;
        this.data.getData('selected options').set(questionId, selectedOption - 1);
        this.data.getData('scores').set(questionId, score);
        console.log('selected option: ' + this.data.getData('selected options').get(questionId));
    }
    getAnswer() {

    }
    getCategories() {

    }
    calculateScores() {
        let totalScore = Array.from(this.data.getData('scores').values()).reduce((a, b) => { return a + b }, 0);
        let candidateName = this.data.getConfigData('candidateName').replace('%20', ' ');
        this.data.setData(['total score', totalScore]);
        alert(`Dear ${candidateName}, you scored ${this.data.getData('total score')} / ${this.data.getData('questions data').length}`);
        this.router.redirect('quiz-finished.html')

    }
    filterCategories() {

    }
}