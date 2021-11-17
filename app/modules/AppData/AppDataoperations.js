import UI_InterfaceClass from "../UI/UI_Interface.js";

export class AppDataOperationsClass {

}
export class QuizzerDataOperationsClass extends AppDataOperationsClass {
    constructor(data) {
        super();
        this.data = data;
        this.UI_Interface = new UI_InterfaceClass();
        this.data.setData(['scores', new Map()]);
    }
    getDifficultyAndQuantityFromData() {
        const difficulty = this.data.getConfigData('selectedDifficulty');
        const quantity = this.data.getConfigData('numberOfQuestions');
        return { difficulty, quantity }
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
            if (this._totalTime == 0) { clearInterval(timerId) }
        }, 1000)
    }
    formatDataEntries(entries) {

    }
    checkAnswer(selectedOptionId, questionId) {
        console.log(`option: ${selectedOptionId}, question: ${questionId}`);
        if (selectedOptionId == this.data.getData('questions data')[questionId].answerId) {
            console.log('Corrext!');
            let score = 1;
            this.data.getData('scores').set(questionId, score)
            console.log(this.data.getData('scores').values());
            return;
        }
        let score = 0;
        this.data.getData('scores').set(questionId, score);
        console.log(this.data.getData('scores').values());
    }
    getAnswer() {

    }
    getCategories() {

    }
    calculateScores() {
        let totalScore = Array.from(this.data.getData('scores').values()).reduce((a, b) => a + b);
        this.data.setData(['total score', totalScore]);
        return `You scored ${this.data.getData('total score')} / ${this.data.getData('questions data').length}`
    }
    filterCategories() {

    }
}