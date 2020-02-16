import firebase from 'firebase/app';
import 'firebase/firestore';
import config from '../config/default';

function getPollingResult(pollingID) {
    const db = firebase.firestore();
    const _pollingCollectionRef = db.collection(config.pollingDB);
    var resultReference = _pollingCollectionRef.doc(pollingID);
    return resultReference.get().then(function(doc) {
        if (doc.exists) {
            return(doc.data()); // {lastUpdate: {datetime}, upvote[]: array, total}
        } else {
            return null;
        }
    });
}

function getUserPollingResult(pollingID, _userID) {
    const db = firebase.firestore();
    const _pollingCollectionRef = db.collection(config.pollingDB);
    if(_userID == null || _userID.length == 0) {
      return null;
    }
    var resultReference = _pollingCollectionRef
            .doc(pollingID).collection('userResult').doc(_userID);
    return resultReference.get().then(function(onValue) {
      if(onValue.exists) {
        return onValue.data(); // {lastUpdate: {datetime}, upvote[]: array}
      } else {
        return null;
      }
    });
  }  

function sendUserPollingResult(pollingID, userid, userResult) {
    const db = firebase.firestore();
    const _pollingCollectionRef = db.collection(config.pollingDB);
    let now = Date.now();
    let lastUpdate = new Date(now);
    userResult['lastUpdate'] = lastUpdate;
    const resultReference = _pollingCollectionRef.doc(pollingID);
    const userResultReference = resultReference.collection('userResult').doc(userid);
    return db.runTransaction(transaction => {
        return transaction.get(resultReference).then(resultDocRef => {
            let resultDoc = userResult;
            resultDoc['total'] = 1;
            if(resultDocRef.exists) {
                resultDoc = resultDocRef.data();
                resultDoc['lastUpdate'] = lastUpdate;
                for(let i = 0; i < userResult['upvote'].length; i++) {
                    resultDoc['upvote'][i] = resultDoc['upvote'][i] + userResult['upvote'][i];
                }
                resultDoc['total'] = resultDoc['total'] + 1;
            } 
            transaction.set(resultReference, resultDoc);
            transaction.set(userResultReference, userResult);
        });
    });
}

export {sendUserPollingResult, getUserPollingResult, getPollingResult}




