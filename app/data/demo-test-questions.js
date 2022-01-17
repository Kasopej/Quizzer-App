export const questionBag = [
  {
    id: 1,
    question:
      "One of the best things about objects is that we can store a function as one of its properties",
    category: "javascript",
    difficulty: 1,
    answers: [
      {
        id: 1,
        answer: "True",
      },
      {
        id: 2,
        answer: "False",
      },
    ],
    answerId: 1,
  },
  {
    id: 2,
    question: "There are ___ primitive types in javaScript",
    category: "javascript",
    difficulty: 1,
    answers: [
      {
        id: 1,
        answer: "8",
      },
      {
        id: 2,
        answer: "6",
      },
      {
        id: 2,
        answer: "9",
      },
      {
        id: 2,
        answer: "7",
      },
    ],
    answerId: 4,
  },
  {
    id: 3,
    question: "toFixed(n) is one of string method",
    category: "javascript",
    difficulty: 1,
    answers: [
      {
        id: 1,
        answer: "true",
      },
      {
        id: 2,
        answer: "false",
      },
    ],
    answerId: 2,
  },
  {
    id: 4,
    question:
      'What will the below expression give <br> let arr = ["I", "go", "home"]; <br> delete arr[1]; <br> array.length',
    category: "javascript",
    difficulty: 1,
    answers: [
      {
        id: 1,
        answer: "2",
      },
      {
        id: 2,
        answer: "3",
      },
      {
        id: 3,
        answer: "2.5",
      },
      {
        id: 4,
        answer: "4",
      },
    ],
    answerId: 2,
  },
  {
    id: 5,
    question:
      "What will the below expression give <br> let arr = [4, 5, 8]; <br> arr.splice(-1, 0, 6,9); <br> console.log(arr) <br>",
    category: "javascript",
    difficulty: 1,
    answers: [
      {
        id: 1,
        answer: "[4,5,9,8,6]",
      },
      {
        id: 2,
        answer: "[4,5,-1,8,6]",
      },
      {
        id: 3,
        answer: "[4,5,6,9,8]",
      },
      {
        id: 4,
        answer: "[-1,5,9,8,6]",
      },
    ],
    answerId: 3,
  },
  {
    id: 6,
    question: `What is the value stored in "newArr" in the below code: <br>
      let arr1 = [2,4,7,9]; <br>
      let newArr = arr1.forEach(el => return el*3);`,
    category: "javascript",
    difficulty: 2,
    answers: [
      {
        id: 1,
        answer: "[4,8,14,18]",
      },
      {
        id: 2,
        answer: "[2,4,7,9]",
      },
      {
        id: 3,
        answer: "[6,12,21,27]",
      },
      {
        id: 4,
        answer: "undefined",
      },
    ],
    answerId: 4,
  },
  {
    id: 7,
    question: `What is the value stored in "position" in the below code: <br>
	let arr1 = [3,6,5]; <br>
	let position = arr1.findIndex(1);`,
    category: "javascript",
    difficulty: 1,
    answers: [
      {
        id: 1,
        answer: "1",
      },
      {
        id: 2,
        answer: "2",
      },
      {
        id: 3,
        answer: "-1",
      },
      {
        id: 4,
        answer: "none of the above",
      },
    ],
    answerId: 3,
  },
];
