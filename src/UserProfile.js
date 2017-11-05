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

function addPublishMessages(user, messageUUID) {
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

export {getUserProfile, updateUserLocation, getUserRecords, addPublishMessages};
