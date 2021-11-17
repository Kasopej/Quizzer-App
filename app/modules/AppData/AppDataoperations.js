import UI_InterfaceClass from "../UI/UI_Interface.js";

export class AppDataOperationsClass {

}
export class QuizzerDataOperationsClass extends AppDataOperationsClass {
    constructor(data) {
        super();
        this.data = data;
        this.UI_Interface = new UI_InterfaceClass();
    }
    calcTotalTime() {
        const difficulty = this.data.getConfigData('selectedDifficulty');
        const quantity = this.data.getConfigData('numberOfQuestions');
        console.log(difficulty + quantity);
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
    checkAnswer() {

    }
    getAnswer() {

    }
    getCategories() {

    }
    calculateScores() {

    }
    filterCategories() {

    }
}