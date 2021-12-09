import UI_InterfaceClass from "../Modules/ui/ui-interface.js";
import {
  HandlerHelpersClass,
  UI_CommandHelperClass,
} from "../Modules/util/helpers.js";
import { CategoriesURL } from "../Modules/util/url.js";
import API_ServiceClass from "../services/api-service.js";
import { LocalDataPersistenceClass } from "../services/persistent-service.js";

const ui_Interface = new UI_InterfaceClass();
const handlerHelper = new HandlerHelpersClass();
const ui_CommandHelper = new UI_CommandHelperClass();
//const api_Service = new API_ServiceClass();
const LocalDataPersistenceService = new LocalDataPersistenceClass();

const isFiltered = new Set(); //set for recording filtering actions
const dateInputs = ui_Interface.getElements("#dateModal input");
const scoreInputs = ui_Interface.getElements("#scoreModal input");

let filteredResultsElementsArray = [];
//const categories = await api_Service.fetchData(CategoriesURL).then(data => data.trivia_categories);
const results = LocalDataPersistenceService.getData("resultsData");
//Create and store table elements for exact number of result objects available
let resultsElementsArray = ui_Interface.createElements(
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
  ui_Interface.attachHTML(
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

ui_Interface.replaceChildren(
  ui_Interface.getElements(".table-light tbody")[0],
  resultsElementsArray
);

//Clone result table elements in order to filter copy while preserving original array available for refiltering
filteredResultsElementsArray = cloneResultsElementsArray(
  filteredResultsElementsArray
);

const filterButtons = ui_Interface.getElements(".filter");
ui_Interface.addEventListenerToElements(
  [
    ui_Interface.getElements(".sort-scores-ascending")[0],
    ui_Interface.getElements(".sort-scores-descending")[0],
  ],
  ["click", "click"],
  [sortElementsArrayByDateReverse, sortElementsArrayByDate]
);

ui_Interface.addEventListenerToElements(
  scoreInputs,
  ["change"],
  [
    function () {
      handlerHelper.limitNumericalEntry.call(this, [100, 0], ["max", "min"]);
    },
  ]
);

ui_Interface.addEventListenerToElements(
  Array.from(filterButtons),
  ["click"],
  [filterData]
);

function cloneResultsElementsArray(cloneTarget) {
  return (cloneTarget = [...resultsElementsArray]);
}

function sortElementsArrayByDate() {
  ui_Interface.sortData(resultsElementsArray, "score", true, ".score", false);
  ui_Interface.replaceChildren(
    ui_Interface.getElements(".table-light tbody")[0],
    resultsElementsArray
  );
}
function sortElementsArrayByDateReverse() {
  ui_Interface.sortData(resultsElementsArray, "score", true, ".score", true);
  ui_Interface.replaceChildren(
    ui_Interface.getElements(".table-light tbody")[0],
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
        ui_Interface.getInputValue(scoreInputs),
        ui_Interface.getInputValue(dateInputs),
      ];
      childSelectors = [".score", ".time"];
      break;
    case "time":
      filterBasis = ["timestamp", "score"];
      filterRanges = [
        ui_Interface.getInputValue(dateInputs),
        ui_Interface.getInputValue(scoreInputs),
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

  ui_Interface.filterData(
    filteredResultsElementsArray,
    filterBasis,
    true,
    childSelectors,
    filterRanges
  );
  ui_Interface.replaceChildren(
    ui_Interface.getElements(".table-light tbody")[0],
    filteredResultsElementsArray
  );
  isFiltered.add(this.id);
}
