import * as firebase from 'firebase';
import uuid from 'js-uuid';
import config from './config/default';

function fetchMessagesBaseOnGeo(geocode, distance, numberOfMessage, callback) {
    var database = firebase.database();  
    var messagesRef = database.ref(config.messageDB);
 // Make sure we remove all previous listeners.
    messagesRef.off();
    console.log("fetchMessageBaseOnGo");
    messagesRef.orderByChild("createdAt").limitToLast(numberOfMessage).on('child_added', callback);
//    messagesRef.orderByChild("createdAt").limitToLast(numberOfMessage).on('child_changed', callback);
 }

 function addMessage(message, currentUser, file, tags, geolocation, start, duration, interval, link) {
    var database = firebase.database();
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
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
        tag: tags,
        createdAt: now,
        key: key,   
        uid: currentUser.uid,
        fbuid: currentUser.providerData[0].uid,
        start: start,
        duration: duration,
        interval: interval,
        link: link
      };
    return database.ref(config.messageDB +'/'+key).set(messageRecord).then((data) => {
        return key;
    })
};
  

function getMessage(uuid) {
    var database = firebase.database();
    return database.ref(config.messageDB +'/'+uuid).once('value').then(function(snapshot) {
        var messageRecord = null;
        if(snapshot != null) {
            messageRecord = snapshot.val();
        } 
        return messageRecord;        
    });;
}

function updateMessage(messageKey, messageRecord, path) {
    var database = firebase.database();
    var updates = {};
    updates['/'+ config.messageDB +'/'+ messageKey + '/' + path] = messageRecord;
    return database.ref().update(updates); 
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
    var database = firebase.database();
    return database.ref(config.concernDB +'/'+messageUuid).once('value').then(function(snapshot) {
        var concernRecord = snapshot.val();         
        if(concernRecord == null) {
            if(isConcern)
            {
                console.log("message Uuid " + messageUuid + " User Id " + user.uid)
                concernRecord = [user.uid];
                return database.ref(config.concernDB +'/'+messageUuid).set(concernRecord).then(() => {
                    return concernRecord
                });
            }
        }
        else
        {
            var index = concernRecord.indexOf(user.uid);
            if(index == -1 && isConcern)
            {
                concernRecord.push(user.uid);
                database.ref(config.concernDB +'/'+messageUuid).set(concernRecord).then(() => {
                    return concernRecord
                });
            }
            else
            {
                if(!isConcern) {
                    concernRecord.splice(index, 1);
                    database.ref(config.concernDB +'/'+messageUuid).set(concernRecord).then(() => {
                        return concernRecord
                    });
                }
            }
        }        
        return concernRecord;        
    });;
    
}

export {fetchMessagesBaseOnGeo, addMessage, addMessageFB_Post, updateMessageImageURL, getMessage, updateMessageConcernUser};
