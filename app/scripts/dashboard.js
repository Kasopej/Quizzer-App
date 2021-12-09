import UiClass from "../Modules/ui/ui.js";
import {
  HandlerHelpersClass,
  UiCommandHelperClass,
} from "../Modules/util/helpers.js";
import { CATEGORIES_URL } from "../Modules/util/url.js";
import ApiServiceClass from "../services/api-service.js";
import { LocalDataPersistenceClass } from "../services/persistent-service.js";

const ui = new UiClass();
const handlerHelper = new HandlerHelpersClass();
const uiCommandHelper = new UiCommandHelperClass();
//const apiService = new ApiServiceClass();
const localDataPersistenceService = new LocalDataPersistenceClass();

const isFiltered = new Set(); //set for recording filtering actions
const dateInputs = ui.getElements("#dateModal input");
const scoreInputs = ui.getElements("#scoreModal input");

let filteredResultsElementsArray = [];
//const categories = await apiService.fetchData(CATEGORIES_URL).then(data => data.trivia_categories);
const results = localDataPersistenceService.getData("resultsData");
//Create and store table elements for exact number of result objects available
let resultsElementsArray = ui.createElements(
  ..."tr ".repeat(results.length).split(" ").slice(0, results.length)
);
if (!Array.isArray(resultsElementsArray)) {
  resultsElementsArray = [resultsElementsArray];
}
//Populate each result table element with appropriate html, data and css classes
resultsElementsArray.forEach((resultElement, index) => {
  let score = results[index].score.split("/");
  let percentScore = (score[0] / score[1]) * 100;
  let email = results[index].candidateEmail;
  ui.attachHTML(
    [resultElement],
    [
      `<td class="time" data-timestamp="${new Date(
        results[index].timeStamp
      ).valueOf()}">${new Date(
        results[index].timeStamp
      ).toDateString()}</td><td>${email}</td><td class="score" data-score="${percentScore}">${percentScore}%</td>`,
    ]
  );
  if (resultElement.querySelector(".score").innerText.slice(0, -1) >= 50) {
    resultElement.querySelector(".score").classList.add("goodResult");
  } else {
    resultElement.querySelector(".score").classList.add("badResult");
  }
});

//Default sorting of result table elements by date before rendering on ui
resultsElementsArray.sort((a, b) => {
  return (
    +a.querySelectorAll("td")[0].dataset.timestamp -
    +b.querySelectorAll("td")[0].dataset.timestamp
  );
});

ui.replaceChildren(
  ui.getElements(".table-light tbody")[0],
  resultsElementsArray
);

//Clone result table elements in order to filter copy while preserving original array available for refiltering
filteredResultsElementsArray = cloneResultsElementsArray(
  filteredResultsElementsArray
);

const filterButtons = ui.getElements(".filter");
ui.addEventListenerToElements(
  [
    ui.getElements(".sort-scores-ascending")[0],
    ui.getElements(".sort-scores-descending")[0],
  ],
  ["click", "click"],
  [sortElementsArrayByDateReverse, sortElementsArrayByDate]
);

ui.addEventListenerToElements(
  scoreInputs,
  ["change"],
  [
    function () {
      handlerHelper.limitNumericalEntry.call(this, [100, 0], ["max", "min"]);
    },
  ]
);

ui.addEventListenerToElements(
  Array.from(filterButtons),
  ["click"],
  [filterData]
);

function cloneResultsElementsArray(cloneTarget) {
  return (cloneTarget = [...resultsElementsArray]);
}

function sortElementsArrayByDate() {
  ui.sortData(resultsElementsArray, "score", true, ".score", false);
  ui.replaceChildren(
    ui.getElements(".table-light tbody")[0],
    resultsElementsArray
  );
}
function sortElementsArrayByDateReverse() {
  ui.sortData(resultsElementsArray, "score", true, ".score", true);
  ui.replaceChildren(
    ui.getElements(".table-light tbody")[0],
    resultsElementsArray
  );
}

function filterData() {
  let filterBasis = [];
  let filterRanges = [];
  let childSelectors = [];
  if (isFiltered.has(this.id)) {
    //If a filter operation has been previously carried out, this detects if the current selected filter operation is the same type (e.g by date) as the last operation
    filteredResultsElementsArray = cloneResultsElementsArray(
      filteredResultsElementsArray
    );
  }
  switch (this.id) {
    //pick correct order of parameters based on current selected filter type
    case "score":
      filterBasis = ["score", "timestamp"];
      filterRanges = [
        ui.getInputValue(scoreInputs),
        ui.getInputValue(dateInputs),
      ];
      childSelectors = [".score", ".time"];
      break;
    case "time":
      filterBasis = ["timestamp", "score"];
      filterRanges = [
        ui.getInputValue(dateInputs),
        ui.getInputValue(scoreInputs),
      ];
      childSelectors = [".time", ".score"];
      break;
    default:
      break;
  }
  //filter out invalid ranges
  filterRanges = filterRanges.filter((range) => {
    let invalidInput;
    for (let value of range) {
      if (value === "" || value !== value) {
        invalidInput = true;
      }
    }
    if (!invalidInput) return true;
  });

  //If no valid range, alert user
  if (!filterRanges.length) alert("Invalid range! Please fill both boxes");

  ui.filterData(
    filteredResultsElementsArray,
    filterBasis,
    true,
    childSelectors,
    filterRanges
  );
  ui.replaceChildren(
    ui.getElements(".table-light tbody")[0],
    filteredResultsElementsArray
  );
  isFiltered.add(this.id);
}
