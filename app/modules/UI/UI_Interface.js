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
        if (!(elements.length > 1) && !(values.length > 1)) {
            elements[0].setAttribute(attributes[0], values[0]);
        }
        else {
            this.helper.helpSetAttributesMultiple(this, elements, attributes, values)
        }
    }
    getAttribute(element, attributeName) {
        return element.getAttribute(attributeName);
    }
    attachText(element, text) {
        element.innerText = text;
    }
    attachElements(parent, children) {
        parent.append(children)
    }
    removeElements() {

    }
    addClassToElements() {

    }
    addEventListenerToElements(element, event, handler) {
        element.addEventListener(event, handler);
    }
}