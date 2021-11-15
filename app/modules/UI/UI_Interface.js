import { UI_CommandHelperClass } from "../util/CommandHelpers.js";

export default class UI_InterfaceClass {
    constructor() {
        this.helper = new UI_CommandHelperClass()
    }
    createElements(...tagNames) {
        if (tagNames.length == 1) {
            return document.createElement(tagNames[0])
        }
        else {
            return this.helper.helpCreateMultipleElements(this, tagNames)
        }
    }
    getElements(selector) {
        return document.querySelectorAll(selector);
    }
    setAttributes = (elements = [], attributes = [], values = []) => {
        if (!(elements.length > 1) && !(attributes.length > 1) && !(values.length > 1)) {
            elements[0].setAttribute(attributes[0], values[0]);
        }
        else {
            this.helper.helpSetEntriesOnMultipleElements(this, 'setAttributes', elements, attributes, values)
        }
    }
    getAttributeFromElements(elements = [], attributeName) {
        let attributeValuesArr = []
        elements.forEach(element => {
            attributeValuesArr.push(element.getAttribute(attributeName))
        })
        return attributeValuesArr;
    }
    getInputValue(elements = []) {
        let inputValuesArr = []
        elements.forEach(element => {
            inputValuesArr.push(element.value)
        })
        return inputValuesArr;
    }
    attachText = (elements = [], texts = []) => {
        if (elements.length == 1) {
            if (texts.length == 1) {
                elements[0].innerText = texts[0];
                return;
            }
            console.log('Unsupported Operation: Cannot set multiple values on a single element');
            return;
        }
        this.helper.helpSetValuesOnMultipleElements(this, 'attachText', elements, texts)
    }
    attachElements(parent, children) {
        parent.append(children)
    }
    removeElements() {

    }
    addClassToElements() {

    }
    addEventListenerToElements(elements, events, handlers) {
        if (!(elements.length > 1) && !(events.length > 1) && !(handlers.length > 1)) {
            elements[0].addEventListener(events[0], handlers[0]);
        }
        else {
            this.helper.helpSetEntriesOnMultipleElements(this, 'addEventListenerToElements', elements, events, handlers)
        }
    }
}