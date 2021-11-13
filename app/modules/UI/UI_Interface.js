import { UI_CommandHelperClass } from "../Helpers/Helpers.js";

export default class UI_InterfaceClass {
    constructor() {
        this.helper = new UI_CommandHelperClass()
    }
    createElements(...tagNames) {
        if (tagNames.length == 1) {
            console.log('One Element created');
            return document.createElement(tagNames[0])
        }
        else {
            return this.helper.helpCreateMultipleElements(this, tagNames)
        }
    }
    getElements() {

    }
    setAttributes(elements = [], attributes = [], values = []) {
        if (!(elements.length > 1) && !(values.length > 1)) {
            console.log('Simple set attribute operation');
            elements[0].setAttribute(attributes[0], values[0]);
        }
        else {
            this.helper.helpSetAttributesMultiple(this, elements, attributes, values)
        }
    }
    attachText() {

    }
    attachElements() {

    }
    removeElements() {

    }
    addClassToElements() {

    }
    addEventListenerToElements() {

    }
}