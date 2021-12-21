//this module carries out DOM operations
import { UiCommandHelperClass } from "../util/helpers.js";

class DOM_OperationError extends Error {
  constructor(message) {
    super(message);
    this.name = "DOM Operation Error";
  }
}

export default class UiClass {
  constructor() {
    this.helper = new UiCommandHelperClass();
  }
  createElements(...tagNames) {
    //this method creates as many elements as required in the same call
    if (tagNames.length == 1) {
      return document.createElement(tagNames[0]);
    } else {
      return this.helper.helpCreateMultipleElements(this, tagNames);
    } //returns an array of the created elements (via helper) if more than one html tag name is specified. If only one html tag name is specified, then it returns the single created element
  }
  getElements(selector) {
    //method to get elements from DOM. Throws & logs error if element could not be found e.g invalid selector or deleted element
    try {
      let nodeListLength = 0;
      const nodeList = document.querySelectorAll(selector);
      [...nodeList].forEach(() => nodeListLength++);
      if (nodeListLength) return nodeList;
      throw new DOM_OperationError("No such HTML elements found in DOM!");
    } catch (error) {
      if (error instanceof DOM_OperationError) {
        console.log(error);
        return [];
      }
    }
  }
  getElementsFromNode(node, selector) {
    //method to get elements from HTML node. Throws & logs error if element could not be found e.g invalid selector or deleted element
    try {
      let nodeListLength = 0;
      const nodeList = node.querySelectorAll(selector);
      [...nodeList].forEach(() => nodeListLength++);
      if (nodeListLength) return nodeList;
      throw new DOM_OperationError("No such HTML elements found in DOM!");
    } catch (error) {
      if (error instanceof DOM_OperationError) {
        console.log(error);
        return [];
      }
    }
  }
  setAttributes = (elements = [], attributes = [], values = []) => {
    //sets multiple attributes values for multiple elements in one call
    if (
      //handles simple case: one element and one attribute
      elements.length === 1 &&
      attributes.length === 1 &&
      values.length === 1
    ) {
      elements[0].setAttribute(attributes[0], values[0]);
    } else {
      //handles multiple case (multiple elements, multiple attributes, multiple values) by iteration via helper function
      this.helper.helpHandleEntriesOnMultipleElements(
        this,
        "setAttributes",
        elements,
        attributes,
        values
      );
    }
  };
  removeAttributes(elements = [], attributes = []) {
    //remove multiple attributes from multiple elements in one call
    if (elements.length == 1) {
      //handles simple case (single elment, single attribute)
      if (attributes.length == 1) {
        elements[0].removeAttribute(attributes[0]);
        return;
      }
      //throw custom error if multiple attributes are passed with a single element
      this.helper.throwHandleMultipleValuesOnSingleElementError(
        elements,
        "removeAttributes",
        attributes,
        DOM_OperationError
      );
      return;
    }
    //handles valid multiple case (multiple elements, multiple attributes) by iteration via helper function
    this.helper.helpHandleValuesOnMultipleElements(
      this,
      "removeAttributes",
      elements,
      texts
    );
  }
  getAttributeFromElements(elements = [], attributeName) {
    //obtains attribute value for as many elements as required. Returns an array of value(s)
    let attributeValuesArr = [];
    elements.forEach((element) => {
      try {
        attributeValuesArr.push(element.getAttribute(attributeName));
        if (!element.hasAttribute(attributeName)) {
          throw new DOM_OperationError(
            `Attribute: ${attributeName} does not exist on ${element}`
          );
        }
      } catch (error) {
        if (error instanceof DOM_OperationError) console.log(error);
      }
    });
    return attributeValuesArr;
  }
  getInputValue(elements = []) {
    //get input values from input elements. Returns an array of value(s)
    let inputValuesArr = [];
    elements.forEach((element) => {
      if (element.getAttribute("type") !== "date") {
        inputValuesArr.push(element.value);
      } else inputValuesArr.push(element.valueAsNumber);
    });
    return inputValuesArr;
  }
  attachText = (elements = [], texts = []) => {
    //attach multiple text strings to multiple elements in one call
    if (elements.length == 1) {
      //simple case
      if (texts.length == 1) {
        elements[0].innerText = texts[0];
        return;
      }
      this.helper.throwHandleMultipleValuesOnSingleElementError(
        elements,
        "attachText",
        texts,
        DOM_OperationError
      );
      return;
    }
    //handles valid multiple case by iteration via helper function
    this.helper.helpHandleValuesOnMultipleElements(
      this,
      "attachText",
      elements,
      texts
    );
  };
  attachHTML = (elements = [], htmlStrings = []) => {
    //append new HTML strings to multiple elements in one call
    if (elements.length == 1) {
      //simple case
      if (htmlStrings.length == 1) {
        elements[0].insertAdjacentHTML("beforeend", htmlStrings[0]);
        return;
      }
      this.helper.throwHandleMultipleValuesOnSingleElementError(
        elements,
        "attachHTML",
        htmlStrings,
        DOM_OperationError
      );
      return;
    }
    //handles valid multiple case by iteration via helper function
    this.helper.helpHandleValuesOnMultipleElements(
      this,
      "attachText",
      elements,
      htmlStrings
    );
  };
  replaceHTML = (elements = [], htmlStrings = []) => {
    //attach new HTML strings to multiple elements in one call, replacing the current HTML in the elements, if any
    if (elements.length == 1) {
      if (htmlStrings.length == 1) {
        elements[0].innerHTML = htmlStrings[0];
        return;
      }
      this.helper.throwHandleMultipleValuesOnSingleElementError(
        elements,
        "replaceHTML",
        htmlStrings,
        DOM_OperationError
      );
      return;
    }
    //handles valid multiple case by iteration via helper function
    this.helper.helpHandleValuesOnMultipleElements(
      this,
      "replaceHTML",
      elements,
      htmlStrings
    );
  };
  attachElements(parent, children) {
    //attach node object or nodelist to node in DOM
    parent.append(children);
  }
  replaceChildren(parent, children) {
    //attach node object or nodelist to node in DOM, replacing existing children
    parent.replaceChildren(...children);
  }
  removeElement(element) {
    element.remove();
  }
  replaceClassOnElements(elements = [], classTokens = []) {
    //replace one class with another
    elements.forEach((element) =>
      element.classList.replace(classTokens[0], classTokens[1])
    );
  }
  addClassToElements(elements = [], classToken) {
    elements.forEach((element) => element.classList.toggle(classToken, true));
  }
  removeClassFromElements(elements = [], classToken) {
    elements.forEach((element) => element.classList.toggle(classToken, false));
  }
  addEventListenerToElements(elements = [], events = [], handlers = []) {
    //attach multiple listeners to multiple elements for multiple event types
    if (elements.length === 1 && events.length === 1 && handlers.length === 1) {
      if (
        //checks if listener is a function or valid EventListener interface i.e implements handleEvent method
        typeof handlers[0] === "function" ||
        (handlers[0] instanceof Object && "handleEvent" in handlers[0])
      ) {
        elements[0].addEventListener(events[0], handlers[0]);
        return;
      }
      this.helper.throwAttachEventListenerError(
        elements[0],
        handlers[0],
        DOM_OperationError
      );
    } else {
      //handles multiple case (elements, events, listeners) by iteration
      this.helper.helpHandleEntriesOnMultipleElements(
        this,
        "addEventListenerToElements",
        elements,
        events,
        handlers
      );
    }
  }
  sortData( //sort array of html elements via helper function
    elementsArray = [],
    basis,
    sortBasedOnChild = Boolean,
    childSelector,
    reverse = Boolean
  ) {
    this.helper.helpSortData(
      this,
      elementsArray,
      basis,
      sortBasedOnChild,
      childSelector,
      reverse
    );
  }
  filterData( //filter array of html elements via helper function
    elementsArray = [],
    basis = [],
    sortBasedOnChild = Boolean,
    childSelectors = [],
    ranges = []
  ) {
    this.helper.filterDataByRanges(
      this,
      elementsArray,
      basis,
      sortBasedOnChild,
      childSelectors,
      ranges
    );
  }
  displayAlert(text) {
    this.addClassToElements([this.getElements("#infoAlert")[0]], "d-block");
    this.attachText(this.getElements(".infoText"), [text]);
  }
  displayPasswordValidationResult(
    passwordInputElement,
    passwordValidationTextElement
  ) {
    this.helper.displayPasswordValidationResult(
      this,
      passwordInputElement,
      passwordValidationTextElement
    );
  }
}
