import * as firebase from 'firebase';
import uuid from 'js-uuid';
import config, {constant, addressEnum, RoleEnum} from './config/default';

function fetchAllUser(callback) {
    const db = firebase.firestore();
    let collectionRef = db.collection(config.userDB);
    collectionRef.onSnapshot(function() {})  
    collectionRef = collectionRef.orderBy("createdAt", "desc").
    get().then(function(querySnapshot) {
        if(querySnapshot.empty) {
            return;
        } else { 
            querySnapshot.forEach(function(userRef) {
                var val = userRef.data();
                if(val) {
                    val.uid = userRef.id;
                    callback(val);
                }
            });
        }
    }).catch(function(error) {
        console.log("Error getting documents: ", error);
    });
 }


function getUserProfile(user) {
    // Use firestore
    if(user==null) {
        return null;
    }
    const db = firebase.firestore();
    
    
    let collectionRef = db.collection(config.userDB);
    let docRef = collectionRef.doc(user.uid);
    let now = Date.now();
    return docRef.get().then(function(doc) {
        if (doc.exists) {
            return(doc.data());
        } else {
            var userRecord = {
                displayName: user.displayName,
                photoURL: user.photoURL,
                fbuid: user.providerData[0].uid,
                desc: "",
                createdAt: new Date(now),
                role: RoleEnum.user,
                publishMessages: [],
                concernMessages: [],
                completeMessages: [],
                lastLogin: new Date(now)
            };
            collectionRef.doc(user.uid).set(userRecord).then(function(userRecordRef) {
                console.log("Document written with ID: ", user.uid);
                upsertAddress(user, "0", addressEnum.home, addressEnum.home, null, null).then(function() {
                    upsertAddress(user, "1", addressEnum.office, addressEnum.office, null, null).then(function() {
                        addBookmark(uuid.v4(), user, 
                            constant.concernLabel, "", []).then(() => {return(userRecord);})
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
    const db = firebase.firestore();
    
    
    let collectionRef = db.collection(config.userDB).doc(user.uid).collection(config.addressBook);
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
    const db = firebase.firestore();
    
    
    const collectionRef = db.collection(config.userDB);
    const docRef = collectionRef.doc(user.uid);
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
    const db = firebase.firestore();
    
    
    let collectionRef = db.collection(config.userDB);
    let docRef = collectionRef.doc(user.uid);
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
    const db = firebase.firestore();
    
    
    let collectionRef = db.collection(config.userDB);
    let docRef = collectionRef.doc(user.uid);
    return docRef.get().then(function(doc) {
        if (doc.exists) {
            return(doc.data().completeMessages);
        } else {
            return(null);
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
        return(null);
    });
}

function addCompleteMessage(user, messageUUID) {
    return getUserProfile(user).then((userRecord) => {
        var rv = true;
        if(userRecord.completeMessages != null)
        {
//            console.log("concernMessages:" + userRecord.concernMessages);            
            var index = userRecord.completeMessages.indexOf(messageUUID);
            if(index == -1)
            {
                userRecord.completeMessages.push(messageUUID);
            }
            else
            {
                rv = false;   
            }
        }
        else
        {
            userRecord.completeMessages = [messageUUID];
        }
        if(rv) {      
            return updateUserRecords(user.uid, userRecord).then(() =>{
                return rv;
            });
        }
        return rv;
    });
}

function toggleConcernMessage(user, messageUUID) {
    return getUserProfile(user).then((userRecord) => {
        var rv = true;
        if(userRecord.concernMessages != null)
        {
//            console.log("concernMessages:" + userRecord.concernMessages);            
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
//        console.log("UserRecord.concernMessages" + userRecord.concernMessages);        
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
    let now = Date.now();
    let lastLogin = new Date(now);
    const db = firebase.firestore();
    let collectionRef = db.collection(config.userDB);
    if(userRecord != null) {
      /* remoe temporary for test new icon */
        userRecord.lastLogin = lastLogin;
        return collectionRef.doc(userid).set(userRecord).then(function(userRecordRef) {
            return(userRecordRef);
        }) 
    } 
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

function fetchBookmarkList(user) {

    const db = firebase.firestore();
    let userID = user.uid;
    let collectionRef = db.collection(config.userDB).doc(userID).collection(config.bookDB);
    collectionRef.onSnapshot(function() {})         
    let query = collectionRef.orderBy("lastUpdate", "desc");
    return query.get().then(function(querySnapshot) {
        if(querySnapshot.empty) {
            return [];
        } else { 
            const bookmarks = querySnapshot.docs.map(bookmarkRef => {
                let val = bookmarkRef.data();
                if(val) {
                    return(val); 
                }                    
            });
            return(bookmarks);
        }
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
        return [];
    });
 }

 function addBookmark(key, user, 
    title, desc, messages) {
    let uid = user.uid;
    let now = Date.now();
    var bookmarkRecord = {
        public: true,
        title: title,
        desc: desc,
        messages: messages,
        createdAt: new Date(now),
        lastUpdate: new Date(now),
        key: key,   
        uid: uid,
        viewCount: 0,
    };      
    // Use firestore
    const db = firebase.firestore();
    return db.collection(config.userDB).doc(uid).collection(config.bookDB).doc(key).set(bookmarkRecord).then(function(recordRef) {
        return(key);
    })
};

function dropBookmark(user, key) {
    let uid = user.uid;
    return getBookmarkRef(user, key).then(function(bookmark) {
        if(bookmark != null) {
            const db = firebase.firestore();
            db.collection(config.userDB).doc(uid).collection(config.bookDB).doc(key).delete().then(function() {
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
  
function getBookmarkRef(user, key) {
    // firestore
    // Use firestore
    let uid = user.uid;
    var db = firebase.firestore();
    var collectionRef = db.collection(config.userDB).doc(uid).collection(config.bookDB);
    var docRef = collectionRef.doc(key);
    return docRef.get().then(function(doc) {
        if (doc.exists) {
            return(doc);
        } else {
            return null;
        }
    });     
}

function getBookmark(user, key) {
    return getBookmarkRef(user, key).then(function (bookmarkRef) {
        if(bookmarkRef != null) {
            let rv = bookmarkRef.data();
            return rv
        } else {
            return null;
        }
    });
}

function incBookmarkViewCount(user, key) {
    return getBookmarkRef(user, key).then(function (bookmarkRef) {
        if(bookmarkRef != null) {
            let viewCount = 1;
            if(bookmarkRef.data().viewCount != null) {
                viewCount = bookmarkRef.data().viewCount + 1;
            }
            const db = firebase.firestore();
            var collectionRef = db.collection(config.userDB).doc(user.uid).collection(config.bookDB);
            var docRef = collectionRef.doc(key);
            return docRef.update({viewCount: viewCount});
        } else {
            return null;
        }
    });
}


function updateBookmark(user, key, bookmarkRecord, isUpdateTime) {
    let uid = user.uid;
    var db = firebase.firestore();
    var now = Date.now();
    var collectionRef = db.collection(config.userDB).doc(uid).collection(config.bookDB);
    if(bookmarkRecord == null) {
        if(isUpdateTime) {
            return collectionRef.doc(key).update({
                lastUpdate: new Date(now)
            }).then(function(bookmarkRecordRef) {
                console.log("Document written with ID: ", key);
                return(bookmarkRecordRef);
            }) 
        }
    } else {
        // we can use this to update the scheme if needed.
        if(isUpdateTime) {
            bookmarkRecord.lastUpdate = new Date(now);
        }
        return collectionRef.doc(key).set(bookmarkRecord).then(function(bookmarkRecordRef) {
            console.log("Document written with ID: ", key);
            return(bookmarkRecordRef);
        })      
    }
}

function upgradeAllUser() {
    const db = firebase.firestore();
    let collectionRef = db.collection(config.userDB);
    collectionRef.onSnapshot(function() {})  
    collectionRef.get().then(function(querySnapshot) {
        if(querySnapshot.empty) {
            return;
        } else { 
            return querySnapshot.forEach(function(userRef) {
                var val = userRef.data();
                if(val) {
                    if(val.createdAt == null) {
                        if(val.lastLogin == null) {
                            let now = Date.now();
                            val.lastLogin = new Date(now);
                        }
                        val.createdAt = val.lastLogin;
                        let collectionRef2 = db.collection(config.userDB);
                        return collectionRef2.doc(userRef.id).set(val).then(function(userRecordRef) {
                            return(userRecordRef);
                        });
                    }
                }                
            });
        }
    })         
}

export {fetchAllUser, addCompleteMessage, upsertAddress, upgradeAllUser, getUserConcernMessages, getUserPublishMessages, getUserCompleteMessages, getUserProfile, addPublishMessagesKeyToUserProfile, toggleConcernMessage, isConcernMessage, updateUserProfile,
    dropBookmark, fetchBookmarkList, addBookmark, getBookmark, updateBookmark, incBookmarkViewCount};

