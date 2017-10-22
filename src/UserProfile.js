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
                locations: {
                    officeLocationLatitude: 0, 
                    officeLocationLongitude: 0,
                    homeLocationLatitude: 0,
                    homeLocationLongitude: 0,    
                },
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
        console.log(JSON.stringify(userRecord));
        return userRecord;        
    });;
}


function updateUserRecords(userid, userRecord, path) {
    var database = firebase.database();
    var updates = {};
    updates['/'+ config.userDB +'/'+userid + '/' + path] = userRecord;
    console.log(JSON.stringify(updates));

    return database.ref().update(updates);    
//    return database.ref(config.userDB +'/'+userid).set(userRecord);
}


function updateUserLocation(user, officeLocationLatitude, officeLocationLongitude, homeLocationLatitude, homeLocationLongitude) {
//    var userRecord = getUserProfile(user);
    var userRecord = {homeLocationLongitude: 0, homeLocationLatitude: 0, officeLocationLatitude: 0, officeLocationLongitude: 0};
    if(homeLocationLatitude != userRecord.homeLocationLatitude && homeLocationLongitude != userRecord.homeLocationLongitude)   {
        userRecord.homeLocationLongitude = homeLocationLongitude;
        userRecord.homeLocationLatitude = homeLocationLatitude;
    }
    if(officeLocationLatitude != userRecord.officeLocationLatitude && officeLocationLongitude != userRecord.officeLocationLongitude)  {
        userRecord.officeLocationLatitude = officeLocationLatitude;
        userRecord.officeLocationLongitude = officeLocationLongitude;
    }
    var path = "locations";
    return updateUserRecords(user.uid, userRecord, path);
}


export {getUserProfile, updateUserLocation, getUserRecords};
