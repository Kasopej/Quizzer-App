export class AppControllerClass {

}

export class QuizzerControllerClass extends AppControllerClass {
    calcTotalTime(difficulty, quantity) {
        console.log(difficulty + quantity);
        switch (difficulty) {
            case 'easy':
                return quantity * 10;
            case 'medium':
                return quantity * 20;
            case 'medium':
                return quantity * 30;
            default:
                break;
        }
    }
    setTotalTime(totalTime) {
        this.totalTime = totalTime;
    }
}