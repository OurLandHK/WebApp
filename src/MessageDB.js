import * as firebase from 'firebase';
import uuid from 'js-uuid';
import config, {constant} from './config/default';
import { light } from 'material-ui/styles/createPalette';

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

function fetchMessagesBaseOnGeo(geocode, radius, numberOfMessage, callback) {

    var db = firebase.firestore();
    var collectionRef = db.collection(config.messageDB);
    collectionRef.onSnapshot(function() {})         
    if(geocode != null && geocode != NaN && geocode.latitude != undefined) {
//        console.log("Get message base on Location: (" + geocode.latitude + " ," + geocode.longitude + ") with Radius: " + radius);
//        boundingBoxCoordinates(center, radius) {
            const KM_PER_DEGREE_LATITUDE = 110.574;
            const latDegrees = radius / KM_PER_DEGREE_LATITUDE;
            const latitudeNorth = Math.min(90, geocode.latitude + latDegrees);
            const latitudeSouth = Math.max(-90, geocode.latitude - latDegrees);
            // calculate longitude based on current latitude
            const longDegsNorth = metersToLongitudeDegrees(radius, latitudeNorth);
            const longDegsSouth = metersToLongitudeDegrees(radius, latitudeSouth);
            const longDegs = Math.max(longDegsNorth, longDegsSouth);
/*            
            return {
              swCorner: { // bottom-left (SW corner)
                latitude: latitudeSouth,
                longitude: wrapLongitude(center.longitude - longDegs),
              },
              neCorner: { // top-right (NE corner)
                latitude: latitudeNorth,
                longitude: wrapLongitude(center.longitude + longDegs),
              },
            };
          }
*/
        let lesserGeopoint = new firebase.firestore.GeoPoint(latitudeSouth, wrapLongitude(geocode.longitude - longDegs));
        let greaterGeopoint = new firebase.firestore.GeoPoint(latitudeNorth, wrapLongitude(geocode.longitude + longDegs));

        // Use firestore

        collectionRef.where("hide", "==", false).where("geolocation", ">=", lesserGeopoint).where("geolocation", "<=", greaterGeopoint).orderBy("geolocation", "desc").limit(numberOfMessage).get().then(function(querySnapshot) {
            querySnapshot.forEach(callback);
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        collectionRef.where("hide", "==", false).where("geolocation", ">=", lesserGeopoint).where("geolocation", "<=", greaterGeopoint).onSnapshot(function(querySnapshot) {
            querySnapshot.forEach(callback);
        })       
    } else {
        // Use firestore
        collectionRef.where("hide", "==", false).orderBy("createdAt", "desc").limit(numberOfMessage).get().then(function(querySnapshot) {
            querySnapshot.forEach(callback);
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        collectionRef.where("hide", "==", false).onSnapshot(function(querySnapshot) {
            querySnapshot.forEach(callback);
        })       
    }
 }

 function addMessage(key, message, currentUser, tags, geolocation, streetAddress, start, duration, interval, link, imageUrl, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL, status) {
    var now = Date.now();
    if(start === "")
    {
      start = null;
      duration = null;
      interval = null;
    }
    var messageRecord = {
        hide: false,
        name: currentUser.displayName,
        text: message,
        photoUrl: currentUser.providerData[0].photoURL || '/images/profile_placeholder.png',
        geolocation: new firebase.firestore.GeoPoint(geolocation.latitude, geolocation.longitude),
        streetAddress: streetAddress,
        tag: tags,
        createdAt: new Date(now),
        lastUpdate: null,
        key: key,   
        uid: currentUser.uid,
        fbuid: currentUser.providerData[0].uid,
        start: new Date(start),
        duration: duration,
        interval: interval,
        link: link,
        imageUrl, publicImageURL, 
        thumbnailImageURL, 
        thumbnailPublicImageURL,
        status: status,
        view: []
      };
    // Use firestore
    const db = firebase.firestore();
    const messageRef = db.collection(config.messageDB).doc(key);
    const userRef = db.collection(config.userDB).doc(currentUser.uid);
    return db.runTransaction(transaction => {
      return transaction.get(userRef).then(userDoc => {
        let publishMessages = userDoc.publishMessages;
        if (publishMessages == null) {
          publishMessages = [key]
        } else {
          publishMessages.push(key);
        }
        transaction.set(messageRef, messageRecord);
        transaction.update(userRef, {
          publishMessages: publishMessages,
          publishMessagesCount: publishMessages.length,
        });
        console.log("Document written with ID: ", key);
        return (key);
      });
    });
};
  

function getMessage(uuid) {
    // firestore
    // Use firestore
    var db = firebase.firestore();
    var collectionRef = db.collection(config.messageDB);
    var docRef = collectionRef.doc(uuid);
    return docRef.get().then(function(doc) {
        if (doc.exists) {
            return(doc.data());
        } else {
            return null;
        }
    });     
}

function updateMessage(messageKey, messageRecord, path) {
    var db = firebase.firestore();
    var now = Date.now();
    var collectionRef = db.collection(config.messageDB);
    if(messageRecord == null) {
        messageRecord.lastUpdate = new Date(now);
        collectionRef.doc(messageKey).update({
            lastUpdate: new Date(now)
        }).then(function(messageRecordRef) {
            console.log("Document written with ID: ", messageKey);
            return(messageRecordRef);
        }) 
    } else {
        messageRecord.lastUpdate = new Date(now);
        collectionRef.doc(messageKey).set(messageRecord).then(function(messageRecordRef) {
            console.log("Document written with ID: ", messageKey);
            return(messageRecordRef);
        })      
    }
}


function updateMessageImageURL(messageKey, firebaseImageURL, publicImageURL) {
    return getMessage(messageKey).then((messageRecord) => {
        if(firebaseImageURL != messageRecord.imageUrl) {
            messageRecord.imageUrl = firebaseImageURL;
        }
        if(publicImageURL != messageRecord.publicImageURL) {
            messageRecord.publicImageURL = publicImageURL;
        }        
        var path = "";
        return updateMessage(messageKey, messageRecord, path);
    });
}

function  addMessageFB_Post(messageKey, fbpost) {
    return getMessage(messageKey).then((messageRecord) => {
        if(messageRecord.fbpost != null)
        {
            messageRecord.fbpost.push(fbpost);
        }
        else
        {
            messageRecord.fbpost = [fbpost];
        }
        var path = "";
        return updateMessage(messageKey, messageRecord, path);
    });
}

function updateMessageConcernUser(messageUuid, user, isConcern) {
    // Use firestore
    return getMessage(messageUuid).then((messageRecord) => {
        if(messageRecord != null) {
            if(messageRecord.concernRecord != null)
            {
                var index = messageRecord.concernRecord.indexOf(user.uid);
                if(index == -1 && isConcern)
                {
                    messageRecord.concernRecord.push(user.uid);
                    var path = "";
                    return updateMessage(messageUuid, messageRecord, path);
                }
                else
                {
                    if(!isConcern) {
                        messageRecord.concernRecord.splice(index, 1);
                        var path = "";
                        return updateMessage(messageUuid, messageRecord, path);
                    }
                }
            } else {
                if(isConcern)
                {
                    console.log("message Uuid " + messageUuid + " User Id " + user.uid)
                    messageRecord.concernRecord = [user.uid];
                    var path = "";
                    return updateMessage(messageUuid, messageRecord, path); 
                }
            }
        } else {
            return null;
        }
    });        
}

/// All about comment
function addComment(messageUUID, currentUser, photo, commentText, tags, geolocation, streetAddress, link, status) {
    var now = Date.now();
    var fireBaseGeo = null;
    var commentRecord = {
        hide: false,
        name: currentUser.displayName,
        photoUrl: currentUser.providerData[0].photoURL || '/images/profile_placeholder.png',
        createdAt: new Date(now),
        lastUpdate: null,
    }; 
    if(commentText != null) {
        commentRecord.text = commentText;
    } else {
        if(geolocation != null) {
            commentRecord.geolocation =  new firebase.firestore.GeoPoint(geolocation.latitude, geolocation.longitude);
            if(streetAddress != null) {
                commentRecord.streetAddress = streetAddress;
            }
        } else {
            if(status != null) {
                commentRecord.changeStatus = status;
            } else {
                if(link != null) {
                    commentRecord.link = link;
                } else {
                    if(tags != null) {
                        commentRecord.tags = tags;
                    }
                }
            }
        }
    }
    console.log(commentRecord);
    // Use firestore
    var db = firebase.firestore();
    var collectionRef = db.collection(config.messageDB);  
    return collectionRef.doc(messageUUID).collection("comment").add(commentRecord).then(function(docRef) {
        console.log("comment written with ID: ", docRef.id);
        return(docRef.id);
    });  
}

function fetchCommentsBaseonMessageID(user, messageUUID, callback) {
    var db = firebase.firestore();
    var collectionRef = db.collection(config.messageDB).doc(messageUUID).collection("comment");
    collectionRef.onSnapshot(function() {})         
    // Use firestore
    collectionRef.where("hide", "==", false).get().then(function(querySnapshot) {
        querySnapshot.forEach(callback);
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

function updateViewCount(messageKey, userId){
    return getMessage(messageKey).then((messageRecord) => {
        var rv = false;
        if(typeof messageRecord.view === "undefined" || messageRecord.view == null){
            messageRecord.view = [];
        }

        if(messageRecord.view.indexOf(userId) == -1){
            messageRecord.view.push(userId);

            var path = "";
            updateMessage(messageKey, messageRecord, path);
            rv = true;
        }

        return rv;
    });
}

export {fetchCommentsBaseonMessageID, addComment, fetchMessagesBaseOnGeo, addMessage, addMessageFB_Post, updateMessageImageURL, getMessage, updateMessageConcernUser, updateViewCount};
