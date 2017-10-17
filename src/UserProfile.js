import * as firebase from 'firebase';
import config from './config/default';

function getUserProfile(user) {
    var database = firebase.database();
    return database.ref(config.userDB +'/'+user.uid).once('value').then(function(snapshot) {
        var userRecord = snapshot.val(); 
        console.log('userRecord: ' + userRecord);
        
        if(userRecord == null)
        {
            userRecord = 
            {
                displayName: user.displayName,
                photoURL: user.photoURL,
                workAddress: null,
                homeAddress: null,
                publishMessages: [],
                concernMessages: [],
                completeMessage: []
            };
            database.ref(config.userDB +'/'+user.uid).set(userRecord);
        }
        return userRecord;        
    });;
}

function setUserAddress(user, homeAddress, workAddress) {
    var database = firebase.database();
    return database.ref(config.userDB +'/'+user.uid).once('value').then(function(snapshot) {
        var userRecord = snapshot.val(); 
        console.log('userRecord: ' + userRecord);       
        if(userRecord == null)
        {
            userRecord = 
            {
                displayName: user.displayName,
                photoURL: user.photoURL,
                workAddress: null,
                homeAddress: null,
                publishMessages: [],
                concernMessages: [],
                completeMessage: []
            };
        }
        console.log('Home Address' + homeAddress);
        if(homeAddress != null)
        {
            userRecord.homeAddress = homeAddress;
        }
        if(workAddress != null)
        {
            userRecord.workAddress = workAddress;
        }
        console.log('userRecord: ' + userRecord);
        
        database.ref(config.userDB +'/'+user.uid).set(userRecord);        
        return userRecord;        
    });;
}

export {getUserProfile, setUserAddress};
