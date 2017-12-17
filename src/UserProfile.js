import * as firebase from 'firebase';
import config from './config/default';

function getUserProfile(user) {
    var database = firebase.database();
    return database.ref(config.userDB +'/'+user.uid).once('value').then(function(snapshot) {
        var userRecord = snapshot.val(); 
        
        if(userRecord == null) {
            userRecord = {
                displayName: user.displayName,
                photoURL: user.photoURL,
                officeLocationLatitude: 0, 
                officeLocationLongitude: 0,
                homeLocationLatitude: 0,
                homeLocationLongitude: 0,
                publishMessages: [],
                concernMessages: [],
                completeMessage: []
            };
            database.ref(config.userDB +'/'+user.uid).set(userRecord);
        }
        return userRecord;        
    });;
}

function getUserRecords(user, path) {
    var database = firebase.database();
    return database.ref(config.userDB +'/'+user.uid + '/' + path).once('value').then(function(snapshot) {
        var userRecord = snapshot.val(); 
        return userRecord;        
    });;
}

function getUserConcernMessages(user) {
    return getUserRecords(user, "concernMessages");
}

function getUserPublishMessages(user) {
    return getUserRecords(user, "publishMessages");
}

function getUserCompleteMessages(user) {
    return getUserRecords(user, "completeMessage");
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
        return updateUserRecords(user.uid, userRecord, path).then(() => {
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


function updateUserRecords(userid, userRecord, path) {
    var database = firebase.database();
    var updates = {};
    updates['/'+ config.userDB +'/'+userid + '/' + path] = userRecord;
    return database.ref().update(updates); 
}

function updateUserLocation(user, officeLocationLatitude, officeLocationLongitude, homeLocationLatitude, homeLocationLongitude) {
    return getUserProfile(user).then((userRecord) => {
        if(homeLocationLatitude != userRecord.homeLocationLatitude && homeLocationLongitude != userRecord.homeLocationLongitude)   {
            userRecord.homeLocationLongitude = homeLocationLongitude;
            userRecord.homeLocationLatitude = homeLocationLatitude;
        }
        if(officeLocationLatitude != userRecord.officeLocationLatitude && officeLocationLongitude != userRecord.officeLocationLongitude)  {
            userRecord.officeLocationLatitude = officeLocationLatitude;
            userRecord.officeLocationLongitude = officeLocationLongitude;
        }
        var path = "";
        return updateUserRecords(user.uid, userRecord, path);
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
        var path = "";
        return updateUserRecords(user.uid, userRecord, path);
    });
}

export {getUserConcernMessages, getUserPublishMessages, getUserCompleteMessages, getUserProfile, updateUserLocation, getUserRecords, addPublishMessagesKeyToUserProfile, toggleConcernMessage, isConcernMessage};
