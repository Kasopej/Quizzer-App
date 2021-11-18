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
    helpSetEntriesOnMultipleElements(caller, method, elements, keys, values) {
        if (elements.length == 1) {
            keys.forEach((key, index) => {
                caller[method]([elements[0]], [key], [values[index]])
            })
        }
        else {
            //First case: set single attribute for multiple elements
            let valueIndex = 0;
            elements.forEach((element, index) => {
                valueIndex = (index < values.length) ? index : valueIndex;
                caller[method]([element], [keys[valueIndex]], [values[valueIndex]])
            })
        }
    }
    helpSetValuesOnMultipleElements(caller, method, elements, values) {
        let valueIndex = 0;
        elements.forEach((element, index) => {
            valueIndex = (index < values.length) ? index : valueIndex;
            caller[method]([element], [values[valueIndex]])
        })
    }
}

