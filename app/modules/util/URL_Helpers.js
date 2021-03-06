export class URL_HelperClass {
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