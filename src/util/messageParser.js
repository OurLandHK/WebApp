import { getGeoLocationFromStreetAddress } from '../Location';
 
/**
 * Parse message description and return a string with YYYY-MM-DD format if it matches with below regex
 * @param {string} messageDesc
 * @returns {(string|null)} 
 */
export function parseDate(messageDesc) {
    return new Promise( (resolve, reject) => {
        // YYYY-MM-DD
        let r1 = /(20[1-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/g;
        // DD/MM/YYYY
        let r2 = /(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(20[1-9]{2})/;
        // 10月31日
        let r3 = /(0[1-9]|1[0-2]).(0[1-9]|[12]\d|3[01])./;
        // 2018年10月31日
        let r4 = /(20[1-9]{2}).(0[1-9]|1[0-2]).(0[1-9]|[12]\d|3[01])./;

        if(messageDesc.match(r1) != null) {
            resolve(messageDesc.match(r1)[0]);
        } else if(messageDesc.match(r2) != null) {
            let YYYY = messageDesc.match(r3)[3];
            let MM = messageDesc.match(r3)[2];
            let DD = messageDesc.match(r3)[1];
            resolve(YYYY + '-' + MM + '-' + DD);
        } else if(messageDesc.match(r3) != null) {
            let YYYY = new Date().getFullYear();
            let MM = messageDesc.match(r3)[1];
            let DD = messageDesc.match(r3)[2];
            resolve(YYYY + '-' + MM + '-' + DD);
        } else if(messageDesc.match(r4) != null) {
            let YYYY = messageDesc.match(r4)[1];
            let MM = messageDesc.match(r4)[2];
            let DD = messageDesc.match(r4)[3];
            resolve(YYYY + '-' + MM + '-' + DD);
        } else {
            reject(null);
        }
    }); 
}

/**
 * Parse message description and return a string with HH:MM format if it matches with below regex
 * @param {string} messageDesc
 * @returns {(string|null)} 
 */
export function parseTime(messageDesc) {
    return new Promise( (resolve, reject) => {
        // HH:MM
        let r1 = /([0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]/g;
        
        if(messageDesc.match(r1) != null) {
            resolve(messageDesc.match(r1)[0]);
        } else {
            reject(null);
        }
    }); 
}


/**
 * Parse message description and return geo location if the location can be resolved
 * @param {string} messageDesc
 * @returns {(object|null)} 
 */
export function parseLocation(messageDesc) {
    return new Promise( (resolve, reject) => {
        let r1 = /(地點|地址)(:| :)(.*)/u;
        
        if(messageDesc.match(r1) != null) {
            if(messageDesc.match(r1)[3] != null) {
                getGeoLocationFromStreetAddress(
                    messageDesc.match(r1)[3], 
                    function(err, response){
                        // success callback
                        if(err) {
                            reject(null);
                        } else {
                            resolve(response)
                        }
                    }, 
                    function() {
                        // error callback
                        reject(null);
                    }
                )
            }
        } else {
            reject(null);
        }
    }); 
}