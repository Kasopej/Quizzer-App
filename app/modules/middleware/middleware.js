export class MiddlewareClass {}

export class QuizzerMiddlewareClass extends MiddlewareClass {
  convertIncomingQuestionDataArray(questionData) {
    questionData.forEach((questionObj, questionObjIndex) => {
      questionObj.difficulty =
        questionObj.difficulty == "easy"
          ? 1
          : questionObj.difficulty == "medium"
          ? 2
          : questionObj.difficulty == "hard"
          ? 3
          : undefined;
      questionObj.answers = questionObj.incorrect_answers.map(
        (answer, answerIndex) => {
          return { id: answerIndex + 1, answer: answer };
        }
      );

      questionObj.answers.push({
        id: questionObj.incorrect_answers.length + 1,
        answer: questionObj.correct_answer,
      });

      questionObj.answers.sort((a, b) => {
        let randomSorter =
          Math.random() * (questionObj.incorrect_answers.length + 1);
        return a.id - b.id * randomSorter;
      });

      questionObj.answers.forEach((answer, answerIndex) => {
        answer.id = answerIndex + 1;
      });

      questionObj.id = questionObjIndex + 1;

      questionObj.answerId =
        questionObj.answers.findIndex((answer) => {
          return answer.answer == questionObj.correct_answer;
        }) + 1;

      delete questionObj.correct_answer;
      delete questionObj.incorrect_answers;
      delete questionObj.type;
    });
    return questionData;
  }
}
