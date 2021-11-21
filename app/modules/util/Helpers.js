export class HelperClass {

}

export class UI_CommandHelperClass extends HelperClass {
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
    throwSetMultipleValuesOnSingleElementError(elements, method, values, errorClass) {
        try {
            throw new errorClass(`Unsupported operation: Cannot attach multiple ${method} values on one element at same time. Element count: ${elements.length} should correspond to values count: ${values.length}`);
        } catch (error) {
            if (error instanceof errorClass) console.log(error);
        }
    }
    throwAttachEventListenerError(element, value, errorClass) {
        try {
            throw new errorClass(`Unsupported operation: Cannot set ${value} as event listener callback on element: ${element}, as it is neither a function neither does it implement EventListener interface`);
        } catch (error) {
            if (error instanceof errorClass) console.log(error);
        }
    }
}

export class HandlerHelpersClass extends HelperClass {
    helpSaveData(saveMethod, ...entries) {
        saveMethod(entries);
    }
    limitNumericalEntry(limits = [], modes = []) {
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
    generateTokenLink(data) {
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

        console.log(token)
        let secret = "Developer Secret";

        let signature = CryptoJS.HmacSHA256(token, secret);
        signature = base64url(signature);

        let signedToken = token + "." + signature;
        console.log(signedToken)
        return signedToken;
    }
    generateQuery(params = []) {
        let query = '';
        params.forEach((parameterEntry, index) => {
            if (index < params.length - 1) {
                query = query + parameterEntry[0] + '=' + parameterEntry[1] + '&';
                return;
            }
            query = query + parameterEntry[0] + '=' + parameterEntry[1];
        })
        return query;
    }
    getParamsFromQueryString(paramStr) {
        let params = {};
        var paramArr = paramStr.split("&");
        for (let i = 0; i < paramArr.length; i++) {
            let tempArr = paramArr[i].split("=");
            params[tempArr[0]] = tempArr[1];
        }
        return params;
    }
}
