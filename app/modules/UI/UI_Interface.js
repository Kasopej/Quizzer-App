import { UI_CommandHelperClass } from "../util/helpers.js";

class DOM_Operation_Error extends Error {
    constructor(message) {
        super(message);
        this.name = "DOM Operation Error"
    }
}

export default class UI_InterfaceClass {//this class carries out DOM operations
    constructor() {
        this.helper = new UI_CommandHelperClass()
    }
    createElements(...tagNames) {//this method creates as many elements as required in the same call
        if (tagNames.length == 1) {
            return document.createElement(tagNames[0])
        }
        else {
            return this.helper.helpCreateMultipleElements(this, tagNames)
        }
    }
    getElements(selector) { //method to get elements from DOM. Throws & logs error if element could not be found i.e invalid selector
        try {
            let nodeListLength = 0;
            const nodeList = document.querySelectorAll(selector);
            [...nodeList].forEach(() => nodeListLength++)
            if (nodeListLength) return nodeList;
            throw new DOM_Operation_Error('No such HTML elements found in DOM!')
        } catch (error) {
            if (error instanceof DOM_Operation_Error) {
                console.log(error);
                return [];
            }
        }
    }
    setAttributes = (elements = [], attributes = [], values = []) => { //sets as many attributes and their values for as many elements as required
        if (!(elements.length > 1) && !(attributes.length > 1) && !(values.length > 1)) {
            elements[0].setAttribute(attributes[0], values[0]);
        }
        else {
            this.helper.helpHandleEntriesOnMultipleElements(this, 'setAttributes', elements, attributes, values)
        }
    }
    removeAttributes(elements = [], attributes = []) {
        if (elements.length == 1) {
            if (attributes.length == 1) {
                elements[0].removeAttribute(attributes[0])
                return;
            }
            this.helper.throwHandleMultipleValuesOnSingleElementError(elements, 'removeAttributes', attributes, DOM_Operation_Error);
            return;
        }
        this.helper.helpHandleValuesOnMultipleElements(this, 'removeAttributes', elements, texts)
    }
    getAttributeFromElements(elements = [], attributeName) { //obtains attribute value for as many elements as required
        let attributeValuesArr = []
        elements.forEach((element) => {
            try {
                attributeValuesArr.push(element.getAttribute(attributeName));
                if (!element.hasAttribute(attributeName)) {
                    throw new DOM_Operation_Error(`Attribute: ${attributeName} does not exist on ${element}`);
                }

            } catch (error) {
                if (error instanceof DOM_Operation_Error) console.log(error);
            }
        })
        return attributeValuesArr;
    }
    getInputValue(elements = []) { //get input values from input elements
        let inputValuesArr = []
        elements.forEach(element => {
            inputValuesArr.push(element.value)
        })
        return inputValuesArr;
    }
    attachText = (elements = [], texts = []) => { //attach text strings to multiple elements as required
        if (elements.length == 1) {
            if (texts.length == 1) {
                elements[0].innerText = texts[0]
                return;
            }
            this.helper.throwHandleMultipleValuesOnSingleElementError(elements, 'attachText', texts, DOM_Operation_Error);
            return;
        }
        this.helper.helpHandleValuesOnMultipleElements(this, 'attachText', elements, texts)
    }
    attachHTML = (elements = [], htmlStrings = []) => { //append new HTML strings to multiple elements as required
        if (elements.length == 1) {
            if (htmlStrings.length == 1) {
                elements[0].insertAdjacentHTML('beforeend', htmlStrings[0]);
                return;
            }
            this.helper.throwHandleMultipleValuesOnSingleElementError(elements, 'attachHTML', htmlStrings, DOM_Operation_Error);
            return;
        }
        this.helper.helpHandleValuesOnMultipleElements(this, 'attachText', elements, htmlStrings)
    }
    replaceHTML = (elements = [], htmlStrings = []) => { //attach new HTML strings to multiple elements as required, replacing the current HTML in the elements, if any
        if (elements.length == 1) {
            if (htmlStrings.length == 1) {
                elements[0].innerHTML = htmlStrings[0]
                return;
            }
            this.helper.throwHandleMultipleValuesOnSingleElementError(elements, 'replaceHTML', htmlStrings, DOM_Operation_Error);
            return;
        }
        this.helper.helpHandleValuesOnMultipleElements(this, 'replaceHTML', elements, htmlStrings)
    }
    attachElements(parent, children) {
        parent.append(children)
    }
    replaceChildren(parent, children) {
        parent.replaceChildren(...children)
    }
    removeElement(element) {
        element.remove();
    }
    replaceClassOnElements(elements = [], classTokens = []) {
        elements.forEach(element => element.classList.replace(classTokens[0], classTokens[1]))
    }
    addClassToElements(elements = [], classToken) {
        elements.forEach(element => element.classList.toggle(classToken, true))
    }
    removeClassFromElements(elements = [], classToken) {
        elements.forEach(element => element.classList.toggle(classToken, false))
    }
    addEventListenerToElements(elements = [], events = [], handlers = []) { //attach listeners to events for elements as required. Calls helper method if required (i.e if multiple elements/methods/listeners passed)
        if (!(elements.length > 1) && !(events.length > 1) && !(handlers.length > 1)) {
            if (typeof handlers[0] === 'function' || (handlers[0] instanceof Object && ('handleEvent' in handlers[0]))) {
                elements[0].addEventListener(events[0], handlers[0]);
                return;
            }
            this.helper.throwAttachEventListenerError(elements[0], handlers[0], DOM_Operation_Error);

        }
        else {
            this.helper.helpHandleEntriesOnMultipleElements(this, 'addEventListenerToElements', elements, events, handlers)
        }
    }
}