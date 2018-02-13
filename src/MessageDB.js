import * as firebase from 'firebase';
import uuid from 'js-uuid';
import config from './config/default';

function fetchMessagesBaseOnGeo(geocode, distance, numberOfMessage, callback) {

    var db = firebase.firestore();
    var collectionRef = db.collection(config.messageDB);
    collectionRef.onSnapshot(function() {})         
    if(geocode != null && geocode != NaN && geocode.latitude != undefined) {
        // ~1 km of lat and lon in degrees
        let lat = 0.009005379598;
        let lon = 0.01129765804;

        let lowerLat = geocode.latitude - (lat * distance);
        let lowerLon = geocode.longitude - (lon * distance);

        let greaterLat = geocode.latitude + (lat * distance);
        let greaterLon = geocode.longitude + (lon * distance)

        let lesserGeopoint = new firebase.firestore.GeoPoint(lowerLat, lowerLon);
        let greaterGeopoint = new firebase.firestore.GeoPoint(greaterLat, greaterLon);

        // Use firestore

        collectionRef.where("geolocation", ">=", lesserGeopoint).where("location", "<=", greaterGeopoint).orderBy("createdAt", "desc").limit(numberOfMessage).get().then(function(querySnapshot) {
            querySnapshot.forEach(callback);
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    } else {
        // Use firestore
        collectionRef.orderBy("createdAt", "desc").limit(numberOfMessage).get().then(function(querySnapshot) {
            querySnapshot.forEach(callback);
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        collectionRef.onSnapshot(function(querySnapshot) {
            querySnapshot.forEach(callback);
        })        
    }
 }

 function addMessage(message, currentUser, file, tags, geolocation, streetAddress, start, duration, interval, link) {
    var now = Date.now();
    console.log("Start: " + start + " Duration: " + duration + " Interval: " + interval + " Link: " + link);
    if(start === "")
    {
      start = null;
      duration = null;
      interval = null;
    }
    var key = uuid.v4();
    var messageRecord = {
        name: currentUser.displayName,
        text: message,
        photoUrl: currentUser.providerData[0].photoURL || '/images/profile_placeholder.png',
        geolocation: new firebase.firestore.GeoPoint(geolocation.latitude, geolocation.longitude),
        streetAddress: streetAddress,
        tag: tags,
        createdAt: new Date(now),
        key: key,   
        uid: currentUser.uid,
        fbuid: currentUser.providerData[0].uid,
        start: new Date(start),
        duration: duration,
        interval: interval,
        link: link
      };
    // Use firestore
    var db = firebase.firestore();
    var collectionRef = db.collection(config.messageDB);  
    return collectionRef.doc(key).set(messageRecord).then(function(userRecordRef) {
        console.log("Document written with ID: ", key);
        return(key);
    })        
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
    var collectionRef = db.collection(config.messageDB);    
    collectionRef.doc(messageKey).set(messageRecord).then(function(messageRecordRef) {
        console.log("Document written with ID: ", messageKey);
        return(messageRecordRef);
    })      
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

export {fetchMessagesBaseOnGeo, addMessage, addMessageFB_Post, updateMessageImageURL, getMessage, updateMessageConcernUser};
