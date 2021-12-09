export class HelperClass {}

export class UiCommandHelperClass extends HelperClass {
  //contains methods that extend functionality of UI_Operation class methods. They are called by UI_Operations class methods if needed
  constructor() {
    super();
    this.btnState = {};
  }
  helpCreateMultipleElements(caller, tagNames) {
    //helper function that breaks down multiple elements call to single element call for the createElements method in ui module
    const listOfNewElements = [];
    tagNames.forEach((tagName) => {
      listOfNewElements.push(caller.createElements(tagName));
    });
    return listOfNewElements;
  }
  helpHandleEntriesOnMultipleElements(caller, method, elements, keys, values) {
    //method allows ui module methods to set multiple (key, value) pairs on multiple elements that have  e.g setAttribute, by simplifying the operation throuh iteration
    if (elements.length == 1) {
      //single element, multiple keys case
      keys.forEach((key, index) => {
        caller[method]([elements[0]], [key], [values[index]]);
      });
    } else {
      //If multiple elements passed, the loop iteratively selects a single set of (key, value) pairs to use for each of the elements
      let valueIndex = 0;
      elements.forEach((element, index) => {
        valueIndex = index < values.length ? index : valueIndex;
        caller[method]([element], [keys[valueIndex]], [values[valueIndex]]);
      });
    }
  }
  helpHandleValuesOnMultipleElements(caller, method, elements, values) {
    //method helps ui module methods set multiple property values on multiple elements in one call e.g innerText, innerHTML
    let valueIndex = 0;
    elements.forEach((element, index) => {
      valueIndex = index < values.length ? index : valueIndex;
      caller[method]([element], [values[valueIndex]]);
    });
  }
  throwHandleMultipleValuesOnSingleElementError(
    elements,
    method,
    values,
    errorClass
  ) {
    //throws amd logs errors if attempt is made to set more than one value on a single element
    try {
      throw new errorClass(
        `Unsupported operation: Cannot attach multiple ${method} values on one element at same time. Element count: ${elements.length} should correspond to values count: ${values.length}`
      );
    } catch (error) {
      if (error instanceof errorClass) console.log(error);
    }
  }
  throwAttachEventListenerError(element, value, errorClass) {
    //throw and log error if attempt is made to attach an invalid listener (i.e not function or EventListener type object)
    try {
      throw new errorClass(
        `Unsupported operation: Cannot set ${value} as event listener callback on element: ${element}, as it is neither a function neither does it implement EventListener interface`
      );
    } catch (error) {
      if (error instanceof errorClass) console.log(error);
    }
  }
  helpSortData(
    caller,
    elementsArray = [],
    basis,
    sortBasedOnChild = Boolean,
    childSelector,
    reverse = Boolean
  ) {
    //elements to sort, basis for sorting
    if (
      //Checks to prevent unnecessary attempts to re-sort elements in the same order
      !(reverse && this.btnState.sortReversed) &&
      this.btnState.sortReversed !== 0
    ) {
      //sorts elements inside array using basis and data stored in the element dataset field. Either targets the elements in the array directly or their children if sortBasedOnChild is true
      this.btnState.sortReversed = 0;
      elementsArray.sort((a, b) => {
        if (!sortBasedOnChild) {
          return a.dataset[basis] - b.dataset[basis];
        } else {
          return (
            caller.getElementsFromNode(a, childSelector)[0].dataset[basis] -
            caller.getElementsFromNode(b, childSelector)[0].dataset[basis]
          );
        }
      });
    }
    if (reverse && !this.btnState.sortReversed) {
      //reverses order of elements in array if reverse operation is specified i.e descending order
      elementsArray.reverse();
      this.btnState.sortReversed = 1;
    }
  }
  filterDataByRanges(
    caller,
    elementsArray = [],
    basis = [],
    sortBasedOnChild = Boolean,
    childSelectors,
    ranges = []
  ) {
    let index = 0;
    if (ranges.length) {
      //filter elements based on basis specified and data in element dataset, replaces elementsArray with filtered elements. Targets child elements if sortBasedOnChild is true
      elementsArray.splice(
        0,
        elementsArray.length,
        ...elementsArray.filter((dataElement) => {
          if (sortBasedOnChild)
            dataElement = caller.getElementsFromNode(
              dataElement,
              childSelectors[index]
            )[0];
          return (
            +dataElement.dataset[basis[index]] >= +ranges[index][0] &&
            +dataElement.dataset[basis[index]] <= +ranges[index][1]
          );
        })
      );
      index++;
      ranges = ranges.slice(index);
      if (ranges.length) {
        //performs recursive calls till all ranges in ranges array are processed
        this.filterDataByRanges(
          caller,
          elementsArray,
          basis.slice(index),
          sortBasedOnChild,
          childSelectors.slice(index),
          ranges
        );
      }
    }
  }
}

export class HandlerHelpersClass extends HelperClass {
  helpSaveData(saveMethod, ...entries) {
    saveMethod(entries);
  }
  limitNumericalEntry(limits = [], modes = []) {
    //Prevents user from entering numerical values beyond set limits
    for (let mode of modes) {
      if (mode == "max") {
        this.value = this.value >= limits[0] ? limits[0] : this.value;
      } else if (mode == "min") {
        this.value = this.value <= limits[1] ? limits[1] : this.value;
      }
    }
  }
}

export class UrlHelperClass extends HelperClass {
  generateTokenLink(data) {
    //encodes query
    function base64url(source) {
      // Encode in classical base64
      let encodedSource = CryptoJS.enc.Base64.stringify(source);

      // Remove padding equal characters
      encodedSource = encodedSource.replace(/=+$/, "");

      // Replace characters according to base64url specifications
      encodedSource = encodedSource.replace(/\+/g, "-");
      encodedSource = encodedSource.replace(/\//g, "_");

      return encodedSource;
    }

    let header = {
      alg: "HS256",
      typ: "JWT",
    };

    let stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    let encodedHeader = base64url(stringifiedHeader);

    let stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    let encodedData = base64url(stringifiedData);

    let token = encodedHeader + "." + encodedData;

    let secret = "Developer Secret";

    let signature = CryptoJS.HmacSHA256(token, secret);
    signature = base64url(signature);

    let signedToken = token + "." + signature;
    return signedToken;
  }
  generateQuery(params = [], skipNullValues = Boolean, propertiesToSkip = []) {
    //generates query string from parameters object properties.
    let query = "";
    for (let index = 0; index < params.length; index++) {
      const parameterEntry = params[index];
      //next, check if parameter is null, NaN or is to be skipped over. If parameter passes check, append to query string
      if (
        (skipNullValues &&
          (parameterEntry[1] === "" ||
            parameterEntry[1] !== parameterEntry[1])) ||
        propertiesToSkip.includes(parameterEntry[0])
      ) {
        continue;
      } else if (index < params.length - 1) {
        query = query + parameterEntry[0] + "=" + parameterEntry[1] + "&";
        continue;
      }
      query = query + parameterEntry[0] + "=" + parameterEntry[1];
    }
    //In the case where the last parameter entry is skipped, there will be an & at the end of the query string
    if (query.endsWith("&")) {
      query = query.slice(0, query.length - 1);
    }
    return query;
  }
  getParamsFromQueryString(paramStr) {
    //get parameters from query strings
    let params = {};
    var paramArr = paramStr.split("&");
    for (let i = 0; i < paramArr.length; i++) {
      let tempArr = paramArr[i].split("=");
      params[tempArr[0]] = tempArr[1];
    }
    return params;
  }
}
