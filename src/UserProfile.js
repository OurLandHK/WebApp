import * as firebase from 'firebase';
import * as firestore from 'firebase/firestore';
import config, {constant, addressEnum} from './config/default';

function getUserProfile(user) {
    // Use firestore
    var db = firebase.firestore();
    var collectionRef = db.collection(config.userDB);
    var docRef = collectionRef.doc(user.uid);
    return docRef.get().then(function(doc) {
        if (doc.exists) {
            return(doc.data());
        } else {
            var userRecord = {
                displayName: user.displayName,
                photoURL: user.photoURL,
                fbuid: user.providerData[0].uid,
                role: constant.user,
                publishMessages: [],
                concernMessages: [],
                completeMessage: []
            };
            collectionRef.doc(user.uid).set(userRecord).then(function(userRecordRef) {
                console.log("Document written with ID: ", user.uid);
                upsertAddress(user, "0", addressEnum.home, addressEnum.home, null, null).then(function() {
                    upsertAddress(user, "1", addressEnum.office, addressEnum.office, null, null).then(function() {
                        return(userRecord);
                    });
                });         
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
                return(null);
            });
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
        return(null);
    });
}

function upsertAddress(user, key, type, text, geolocation, streetAddress) {
    var geoPoint = null;
    if(geolocation != null) {
    geoPoint = new firebase.firestore.GeoPoint(geolocation.latitude, geolocation.longitude);
    }
    var now = Date.now();
    var addressRecord = {
        type: type,
        updateAt: new Date(now),
        text: text,
        geolocation: geoPoint,
        streetAddress: streetAddress
    }; 
    console.log(addressRecord);
    // Use firestore
    var db = firebase.firestore();
    var collectionRef = db.collection(config.userDB).doc(user.uid).collection(config.addressBook);
    if(key != null) {
        return collectionRef.doc(key).set(addressRecord).then(function() {
            return;
        });
    } else {
        return collectionRef.add(addressRecord).then(function(docRef) {
            console.log("comment written with ID: ", docRef.id);
            return;
        });
    }  
}

function getUserConcernMessages(user) {
    var db = firebase.firestore();
    var collectionRef = db.collection(config.userDB);
    var docRef = collectionRef.doc(user.uid);
    return docRef.get().then(function(doc) {
        if (doc.exists) {
            return(doc.data().concernMessages);
        } else {
            return(null);
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
        return(null);
    });
}

function getUserPublishMessages(user) {
    var db = firebase.firestore();
    var collectionRef = db.collection(config.userDB);
    var docRef = collectionRef.doc(user.uid);
    return docRef.get().then(function(doc) {
        if (doc.exists) {
            return(doc.data().publishMessages);
        } else {
            return(null);
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
        return(null);
    });
}

function getUserCompleteMessages(user) {
    var db = firebase.firestore();
    var collectionRef = db.collection(config.userDB);
    var docRef = collectionRef.doc(user.uid);
    return docRef.get().then(function(doc) {
        if (doc.exists) {
            return(doc.data().completeMessage);
        } else {
            return(null);
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
        return(null);
    });
}

function toggleConcernMessage(user, messageUUID) {
    return getUserProfile(user).then((userRecord) => {
        var rv = true;
        if(userRecord.concernMessages != null)
        {
            console.log("concernMessages:" + userRecord.concernMessages);            
            var index = userRecord.concernMessages.indexOf(messageUUID);
            if(index == -1)
            {
                userRecord.concernMessages.push(messageUUID);
            }
            else
            {
                userRecord.concernMessages.splice(index, 1);
                rv = false;
                
            }
        }
        else
        {
            userRecord.concernMessages = [messageUUID];
        }
        var path = "";
        console.log("UserRecord.concernMessages" + userRecord.concernMessages);        
        return updateUserRecords(user.uid, userRecord).then(function(userRecordRef){
            return rv;
        });
    });
}

function isConcernMessage(user, messageUUID) {
    return getUserProfile(user).then((userRecord) => {
        var rv = false;
        if(userRecord.concernMessages != null)
        {
            var index = userRecord.concernMessages.indexOf(messageUUID);
            if(index != -1)
            {
                rv = true;
            }
        }
        return rv;
    });
}


function updateUserRecords(userid, userRecord) {
    var db = firebase.firestore();
    var collectionRef = db.collection(config.userDB);    
    return collectionRef.doc(userid).set(userRecord).then(function(userRecordRef) {
        console.log("Document written with ID: ", userid);
        return(userRecordRef);
    }) 
}

function addPublishMessagesKeyToUserProfile(user, messageUUID) {
    return getUserProfile(user).then((userRecord) => {
        if(userRecord.publishMessages != null)
        {
            userRecord.publishMessages.push(messageUUID);
        }
        else
        {
            userRecord.publishMessages = [messageUUID];
        }
        return updateUserRecords(user.uid, userRecord);
    });
}

/*
    Update a user's profile
*/
function updateUserProfile(user, userProfile){
    return getUserProfile(user).then((userRecord) => {
        var rv = null;
        updateUserRecords(user.uid, userProfile).then(function() {
            // Update successful.
            rv = true;
            return rv;
        }).catch(function(error) {
          // An error happened.
          alert(error);
          rv = false;
          return rv;
        });

        return rv;
    });
}

export {upsertAddress, getUserConcernMessages, getUserPublishMessages, getUserCompleteMessages, getUserProfile, addPublishMessagesKeyToUserProfile, toggleConcernMessage, isConcernMessage, updateUserProfile};

