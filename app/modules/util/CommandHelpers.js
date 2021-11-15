export class CommandHelperClass {

}

export class UI_CommandHelperClass extends CommandHelperClass {
    helpCreateMultipleElements(caller, tagNames) {
        const listOfNewElements = [];
        tagNames.forEach(tagName => {
            listOfNewElements.push(caller.createElements(tagName))
        })
        return listOfNewElements;
    }
    helpSetAttributesMultiple(caller, elements, attributes, values) {
        if (elements.length == 1) {
            attributes.forEach((attribute, index) => {
                caller.setAttributes(elements[0], attribute, values[index])
            })
        }
        else {
            //First case: set single attribute with single attribute value for multiple elements
            if (attributes.length == 1) {
                let valueIndex = 0
                elements.forEach((element, index) => {
                    valueIndex = (index < values.length) ? index : valueIndex;
                    caller.setAttributes(element, attributes[0], values[valueIndex])
                })
            }
            else {
                console.log('Unsupported Operation: You cannot set multiple attributes on multiple elements in the same call');
            }
        }

    }
}

