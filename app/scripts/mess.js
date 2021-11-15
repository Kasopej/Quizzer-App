let realAPI_Questions = [
    {
        id: 1,
        question: "What is hoisting in Javascript",
        category: "javascript",
        difficulty: 1,
        answers: [
            {
                id: 1,
                answer: "Movement of initialized variables to the top of a module/file for module/file-wide access"
            },
            {
                id: 2,
                answer: "Repositioning of a flag to the top of a pole"
            },
            {
                id: 3,
                answer: "A technique for dynamic styling of Vue components"
            },
            {
                id: 4,
                answer: "Repeated usage of the command line interface"
            },
        ],
        answerId: 1
    },
]
let FakeAPI_Questions = [
    {
        "category": "Sports",
        "type": "multiple",
        "difficulty": "medium",
        "question": "With which team did Michael Schumacher make his Formula One debut at the 1991 Belgian Grand Prix?",
        "correct_answer": "Jordan",
        "incorrect_answers": [
            "Benetton",
            "Ferrari",
            "Mercedes"
        ]
    },
]
FakeAPI_Questions.forEach((questionObj, mainIndex) => {
    questionObj.difficulty = (questionObj.difficulty == 'easy') ? 1 : (questionObj.difficulty == "medium") ? 2 : (questionObj.difficulty == "hard") ? 3 : undefined;
    questionObj.answers = questionObj.incorrect_answers.map((answer, index) => {
        return { id: index + 1, answer: answer }
    })
    questionObj.answers.push({ id: questionObj.incorrect_answers.length + 1, answer: questionObj.correct_answer })
    questionObj.answers.sort((a, b) => {
        let randomSorter = Math.random() * (questionObj.incorrect_answers.length + 1)
        return a.id - b.id * randomSorter;
    })
    questionObj.answers.forEach((answer, index) => {
        answer.id = index + 1;
    })
    questionObj.id = mainIndex + 1
    questionObj.answerId = questionObj.answers.findIndex(answer => {
        return answer.answer == questionObj.correct_answer
    }) + 1

    delete questionObj.correct_answer;
    delete questionObj.incorrect_answers;
    delete questionObj.type;
})

console.log(JSON.stringify(FakeAPI_Questions[0].answers));
console.log(FakeAPI_Questions);