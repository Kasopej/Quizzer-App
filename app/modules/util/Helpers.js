import UI_InterfaceClass from "../UI/ui_Interface.js";

export class HelperClass {

}

export class UI_CommandHelperClass extends HelperClass {//contains methods that extend functionality of UI_Operation class methods. They are called by UI_Operations class methods if needed
    constructor() {
        super();
        this.btnState = {};
    }
    helpCreateMultipleElements(caller, tagNames) {
        const listOfNewElements = [];
        tagNames.forEach(tagName => {
            listOfNewElements.push(caller.createElements(tagName))
        })
        return listOfNewElements;
    }
    helpHandleEntriesOnMultipleElements(caller, method, elements, keys, values) {//method allows UI_Operation methods to carry out multiple operations on multiple elements that have (key, value) pairs e.g setAttribute
        if (elements.length == 1) {
            keys.forEach((key, index) => {
                caller[method]([elements[0]], [key], [values[index]])
            })
        }
        else {
            //If multiple elements passed, the loop iteratively selects a single set of (key, value) pairs to use for each of the elements
            let valueIndex = 0;
            elements.forEach((element, index) => {
                valueIndex = (index < values.length) ? index : valueIndex;
                caller[method]([element], [keys[valueIndex]], [values[valueIndex]])
            })
        }
    }
    helpHandleValuesOnMultipleElements(caller, method, elements, values) { //method allows UI_Interface methods to carry out multiple operations on multiple elements that require values only e.g innerText, innerHTML
        let valueIndex = 0;
        elements.forEach((element, index) => {
            valueIndex = (index < values.length) ? index : valueIndex;
            caller[method]([element], [values[valueIndex]])
        })
    }
    throwHandleMultipleValuesOnSingleElementError(elements, method, values, errorClass) { //throws amd logs errors if attempt is made to set more than one value on a single element
        try {
            throw new errorClass(`Unsupported operation: Cannot attach multiple ${method} values on one element at same time. Element count: ${elements.length} should correspond to values count: ${values.length}`);
        } catch (error) {
            if (error instanceof errorClass) console.log(error);
        }
    }
    throwAttachEventListenerError(element, value, errorClass) { //throw and log error if attempt is made to attache more than one listener to an element event at the same time
        try {
            throw new errorClass(`Unsupported operation: Cannot set ${value} as event listener callback on element: ${element}, as it is neither a function neither does it implement EventListener interface`);
        } catch (error) {
            if (error instanceof errorClass) console.log(error);
        }
    }
    helpSortData(caller, dataArray = [], basis, sortBasedOnChild = Boolean, childSelector, reverse = Boolean) {//data to sort, basis for sorting
        if (!(reverse && this.btnState.sortReversed) && this.btnState.sortReversed !== 0) {
            this.btnState.sortReversed = 0;
            dataArray.sort((a, b) => {
                if (!sortBasedOnChild) {
                    return a.dataset[basis] - b.dataset[basis];
                }
                else {
                    return caller.getElementsFromNode(a, childSelector)[0].dataset[basis] - caller.getElementsFromNode(b, childSelector)[0].dataset[basis]
                }
            })
        }
        if (reverse && !this.btnState.sortReversed) {
            dataArray.reverse();
            this.btnState.sortReversed = 1;
        }

        dataArray.forEach(data => JSON.stringify(data))
    }
    filterDataByRanges(dataArray = [], basis = [], sortBasedOnChild = Boolean, ranges = []) {
        let index = 0;
        const filteredDataArray = [];
        if (ranges.length == 1) {
            filteredDataArray = dataArray.filter(dataElement => {
                return dataElement[basis[index]] >= ranges[index][0] && dataElement[basis[index]] <= ranges[index][1]
            })
            index++;
            ranges.slice(index);
            if (ranges.length) {
                this.filterDataByRanges(filteredDataArray, basis.slice(index), ranges.slice(index))
            }
            return filteredDataArray;
        }
    }
}

export class HandlerHelpersClass extends HelperClass {
    helpSaveData(saveMethod, ...entries) {
        saveMethod(entries);
    }
    limitNumericalEntry(limits = [], modes = []) { //Prevents user from entering numerical values beyond set limits
        for (let mode of modes) {
            if (mode == 'max') {
                this.value = this.value > limits[0] ? limits[0] : this.value;
            }
            else if (mode == 'min') {
                this.value = this.value < limits[1] ? limits[1] : this.value;
            }
        }
    }
}

export class URL_HelperClass extends HelperClass {
    generateTokenLink(data) { //encodes query
        function base64url(source) {
            // Encode in classical base64
            let encodedSource = CryptoJS.enc.Base64.stringify(source);

            // Remove padding equal characters
            encodedSource = encodedSource.replace(/=+$/, '');

            // Replace characters according to base64url specifications
            encodedSource = encodedSource.replace(/\+/g, '-');
            encodedSource = encodedSource.replace(/\//g, '_');

            return encodedSource;
        }

        let header = {
            "alg": "HS256",
            "typ": "JWT"
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
    generateQuery(params = [], skipNullValues = Boolean, propertiesToSkip = []) {//generates query from parameters object. Skips null values and any specifid properties that should be omitted from the query string
        let query = '';
        for (let index = 0; index < params.length; index++) {
            const parameterEntry = params[index];
            if ((skipNullValues && parameterEntry[1] === '') || propertiesToSkip.includes(parameterEntry[0])) {
                continue;
            }

            else if (index < params.length - 1) {
                query = query + parameterEntry[0] + '=' + parameterEntry[1] + '&';
                continue;
            }
            query = query + parameterEntry[0] + '=' + parameterEntry[1];
        }
        if (query.endsWith('&')) { query = query.slice(0, query.length - 1) }
        return query;
    }
    getParamsFromQueryString(paramStr) { //get params from query strings
        let params = {};
        var paramArr = paramStr.split("&");
        for (let i = 0; i < paramArr.length; i++) {
            let tempArr = paramArr[i].split("=");
            params[tempArr[0]] = tempArr[1];
        }
        return params;
    }
}
