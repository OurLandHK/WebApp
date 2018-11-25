import { getGeoLocationFromStreetAddress } from '../Location';
 
/**
 * Parse message description and return a string with YYYY-MM-DD format if it matches with below regex
 * @param {string} messageDesc
 * @returns {(string|null)} 
 */
export function parseDate(messageDesc) {
    return new Promise( (resolve, reject) => {
        // YYYY-MM-DD
        let r1 = /(20[1-9]{2})(-|\/)([1-9]|0[1-9]|1[0-2])(-|\/)([1-9]|0[1-9]|[12]\d|3[01])/;
        // DD/MM/YYYY
        let r2 = /([1-9]|0[1-9]|[12]\d|3[01])(-|\/)([1-9]|0[1-9]|1[0-2])(-|\/)(20[1-9]{2})/;
        // 10月31日
        let r3 = /([1-9]|0[1-9]|1[0-2])月([1-9]|0[1-9]|[12]\d|3[01])日/u;
        // 2018年10月31日
        let r4 = /(20[1-9]{2})年([1-9]|0[1-9]|1[0-2])月([1-9]|0[1-9]|[12]\d|3[01])日/u;

        if(messageDesc.match(r1) != null) {
            resolve(messageDesc.match(r1)[0]);
        } else if(messageDesc.match(r2) != null) {
            let YYYY = messageDesc.match(r2)[3];
            let MM = messageDesc.match(r2)[2];
            let DD = messageDesc.match(r2)[1];
            if(MM.length == 1) {
                MM = '0'+MM;
            }
            if(DD.length == 1) {
                DD = '0'+DD;
            }
            resolve(YYYY + '-' + MM + '-' + DD);
        } else if(messageDesc.match(r3) != null) {
            let YYYY = new Date().getFullYear();
            let MM = messageDesc.match(r3)[1];
            let DD = messageDesc.match(r3)[2];
            if(MM.length == 1) {
                MM = '0'+MM;
            }
            if(DD.length == 1) {
                DD = '0'+DD;
            }
            resolve(YYYY + '-' + MM + '-' + DD);
        } else if(messageDesc.match(r4) != null) {
            let YYYY = messageDesc.match(r4)[1];
            let MM = messageDesc.match(r4)[2];
            let DD = messageDesc.match(r4)[3];
            if(MM.length == 1) {
                MM = '0'+MM;
            }
            if(DD.length == 1) {
                DD = '0'+DD;
            }
            resolve(YYYY + '-' + MM + '-' + DD);
        } else {
            resolve(null);
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
        let r1 = /(2[0-3]|[01]?[0-9]):([0-5]?[0-9])/;
        let r2 = /(下午)/;
        
        if(messageDesc.match(r1) != null) {
            let HH = messageDesc.match(r1)[1];
            let MM = messageDesc.match(r1)[2];

            if(HH.length == 1) {
                HH = '0' + HH;
            }

            if(MM.length == 1) {
                MM = '0' + MM;
            }

            if(messageDesc.match(r2) != null) {
                if(parseInt(HH) < 12) {
                    HH = parseInt(HH) + 12;
                }
            }
            
            resolve(HH + ':' + MM);
        } else {
            resolve(null);
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
        let r1 = /(地點|地址)(:| :|：| ：)(.*)/u;
        
        if(messageDesc.match(r1) != null) {
            if(messageDesc.match(r1)[3] != null) {
                getGeoLocationFromStreetAddress(
                    messageDesc.match(r1)[3], 
                    function(err, response){
                        // success callback
                        if(err) {
                            resolve(null);
                        } else {
                            resolve(response)
                        }
                    }, 
                    function() {
                        // error callback
                        resolve(null);
                    }
                )
            }
        } else {
            resolve(null);
        }
    }); 
}