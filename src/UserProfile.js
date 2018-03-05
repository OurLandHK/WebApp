import * as firebase from 'firebase';
import * as firestore from 'firebase/firestore';
import config, {constant} from './config/default';
//import { GeoPoint } from '@firebase/firestore-types';

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
                officeLocation: constant.invalidLocation, 
                homeLocation: constant.invalidLocation,
                role: constant.user,
                publishMessages: [],
                concernMessages: [],
                completeMessage: []
            };
            collectionRef.doc(user.uid).set(userRecord).then(function(userRecordRef) {
                console.log("Document written with ID: ", user.uid);
                return(userRecordRef.data);
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

function updateUserLocation(user, officeLocationLatitude, officeLocationLongitude, homeLocationLatitude, homeLocationLongitude) {
    return getUserProfile(user).then((userRecord) => {
        if(homeLocationLatitude != userRecord.homeLocation.latitude && homeLocationLongitude != userRecord.homeLocation.longitude)   {
            userRecord.homeLocation = new firebase.firestore.GeoPoint(homeLocationLatitude, homeLocationLongitude);
        }
        if(officeLocationLatitude != userRecord.officeLocation.latitude && officeLocationLongitude != userRecord.officeLocation.longitude)  {
            userRecord.homeLocation = new firebase.firestore.GeoPoint(homeLocationLatitude, homeLocationLongitude);
        }
        return updateUserRecords(user.uid, userRecord);
    });
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

/// All about address
function fetchAddressBaseonUser(user, callback) {
    var db = firebase.firestore();
    var collectionRef = collectionRef.doc(user.uid).collection("AddressBook");
    collectionRef.onSnapshot(function() {})         
    // Use firestore
    collectionRef.get().then(function(querySnapshot) {
        querySnapshot.forEach(callback);
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

function addAddress(currentUser, text, geolocation, streetAddress) {
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


export {fetchAddressBaseonUser, getUserConcernMessages, getUserPublishMessages, getUserCompleteMessages, getUserProfile, updateUserLocation, addPublishMessagesKeyToUserProfile, toggleConcernMessage, isConcernMessage};

