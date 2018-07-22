/*

This is the abstraction layer to get all Global Setting for the Appl

*/

import * as firebase from 'firebase';
import uuid from 'js-uuid';
import config, {constant} from './config/default';
import distance from './Distance';
import { getStreetAddressFromGeoLocation} from './Location';


function degreesToRadians(degrees) {return (degrees * Math.PI)/180;}

function metersToLongitudeDegrees(distance, latitude) {
    const EARTH_EQ_RADIUS = 6378137.0;
    // this is a super, fancy magic number that the GeoFire lib can explain (maybe)
    const E2 = 0.00669447819799;
    const EPSILON = 1e-12;
    const radians = degreesToRadians(latitude);
    const num = Math.cos(radians) * EARTH_EQ_RADIUS * Math.PI / 180;
    const denom = 1 / Math.sqrt(1 - E2 * Math.sin(radians) * Math.sin(radians));
    const deltaDeg = num * denom;
    if (deltaDeg < EPSILON) {
      return distance > 0 ? 360 : 0;
    }
    // else
    return Math.min(360, distance / deltaDeg);
}

function wrapLongitude(longitude) {
    if (longitude <= 180 && longitude >= -180) {
        return longitude;
    }
    const adjusted = longitude + 180;
    if (adjusted > 0) {
        return (adjusted % 360) - 180;
    }
    // else
    return 180 - (-adjusted % 360);
}


function fetchFocusMessagesBaseOnGeo(geocode, radius) {

    const db = firebase.firestore();
    
    let collectionRef = db.collection(config.focusMessageDB);
    collectionRef.onSnapshot(function() {})         
    if(geocode != null && geocode != NaN && geocode.latitude != undefined) {
        const KM_PER_DEGREE_LATITUDE = 110.574;
        const latDegrees = radius / KM_PER_DEGREE_LATITUDE;
        const latitudeNorth = Math.min(90, geocode.latitude + latDegrees);
        const latitudeSouth = Math.max(-90, geocode.latitude - latDegrees);
//            console.log(latitudeSouth + ' ' + geocode.latitude + ' ' + latDegrees);
        // calculate longitude based on current latitude
        const longDegsNorth = metersToLongitudeDegrees(radius, latitudeNorth);
        const longDegsSouth = metersToLongitudeDegrees(radius, latitudeSouth);
        const longDegs = Math.max(longDegsNorth, longDegsSouth);

        let lesserGeopoint = new firebase.firestore.GeoPoint(latitudeSouth, wrapLongitude(geocode.longitude - longDegs));
        let greaterGeopoint = new firebase.firestore.GeoPoint(latitudeNorth, wrapLongitude(geocode.longitude + longDegs));

        // Use firestore

        let query = collectionRef.where("geolocation", ">=", lesserGeopoint).where("geolocation", "<=", greaterGeopoint).orderBy("geolocation", "desc");
        return query.get().then(function(querySnapshot) {
            if(querySnapshot.empty) {
                return [];
            } else { 
                const focusMessages = querySnapshot.docs.map(messageRef => {
                    let val = messageRef.data();
                    if(val) {
                        let lon = geocode.longitude;
                        let lat = geocode.latitude;
                        let dis = distance(val.geolocation.longitude,val.geolocation.latitude,lon,lat);
                        if(dis < radius) {
                            return(val); 
                        } else {
                            return(null);
                        }
                    }                    
                });
                return(focusMessages);
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
            return [];
        });
    } else {
        // Use firestore
        return collectionRef.get().then(function(querySnapshot) {
            const focusMessages = querySnapshot.docs.map(messageRef => {return messageRef.data()});
            return (focusMessages);
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
            return [];
        });
    }
 }

 function addFocusMessage(key, title, geolocation, streetAddress, radius , desc, messages) {
    let now = Date.now();
    var focusMessageRecord = {
        title: title,
        desc: desc,
        messages: messages,
        geolocation: new firebase.firestore.GeoPoint(geolocation.latitude, geolocation.longitude),
        streetAddress: streetAddress,
        radius: radius,
        createdAt: new Date(now),
        lastUpdate: new Date(now),
        key: key,   
      };
    // Use firestore
    const db = firebase.firestore();
    const focusMessageRef = db.collection(config.focusMessageDB).doc(key).set(focusMessageRecord).then(function(recordRef) {
        return(key);
    })
};

function dropFocusMessage(key) {
    return getFocusMessage(key).then(function(message) {
        if(message != null) {
            const db = firebase.firestore();
            db.collection(config.focusMessageDB).doc(key).delete().then(function() {
                console.log("Document successfully deleted!");
                return true;
            }).catch(function(error) {
                console.error("Error removing document: ", error);
                return false;
            });
        } else {
            return false;
        }
    });
}
  
function getFocusMessageRef(key) {
    // firestore
    // Use firestore
    var db = firebase.firestore();
    var collectionRef = db.collection(config.focusMessageDB);
    var docRef = collectionRef.doc(key);
    return docRef.get().then(function(doc) {
        if (doc.exists) {
            return(doc);
        } else {
            return null;
        }
    });     
}

function getFocusMessage(key) {
    return getFocusMessageRef(key).then(function (messageRef) {
        if(messageRef != null) {
            let rv = messageRef.data();
            return rv
        } else {
            return null;
        }
    });
}

function updateFocusMessage(messageKey, messageRecord, updateTime) {
    var db = firebase.firestore();
    var now = Date.now();
    var collectionRef = db.collection(config.focusMessageDB);
    if(messageRecord == null) {
        if(updateTime) {
            return collectionRef.doc(messageKey).update({
                lastUpdate: new Date(now)
            }).then(function(messageRecordRef) {
                console.log("Document written with ID: ", messageKey);
                return(messageRecordRef);
            }) 
        }
    } else {
        // we can use this to update the scheme if needed.
        if(updateTime) {
            messageRecord.lastUpdate = new Date(now);
        }
        return collectionRef.doc(messageKey).set(messageRecord).then(function(messageRecordRef) {
            console.log("Document written with ID: ", messageKey);
            return(messageRecordRef);
        })      
    }
}


export {dropFocusMessage, fetchFocusMessagesBaseOnGeo, addFocusMessage, getFocusMessage, updateFocusMessage};
