import * as firebase from 'firebase';
import config from './config/default';
import postFbMessage from './FacebookPost';
import {addPublishMessagesKeyToUserProfile} from './UserProfile';
import {addMessage, updateMessageImageURL} from './MessageDB';
import geoString from './GeoLocationString';
import imageResizer from './ImageResizer';


function validateFile(file) {
  if (! file) {
    console.log("file not exist: " + file); 
    return false;    
  }

  if(!file.type.match('image.*')) {
    console.log("File is not image:" + file);
    var data = {
      message: 'You can only share images',
      timeout: 2000
    };
    //TODO: call snackbar
    //this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
    return false;
  }
  return true;
};

function uploadImage(currentUser, messageKey, filename, blob) {

//  var Jimp = require("jimp");
  var filePath = currentUser.uid + '/' + messageKey + '/' + filename;
  var storage = firebase.storage();
  return storage.ref(filePath).put(blob);  
};


function postMessage(message, file, tags, geolocation, streetAddress, start, duration, interval, link, status) {
  var auth = firebase.auth();
  var currentUser = auth.currentUser;     
  var mapString = "\nhttps://www.google.com.hk/maps/place/"+ geoString(geolocation.latitude, geolocation.longitude) + "/@" + geolocation.latitude + "," + geolocation.longitude + ",18z/";
    addMessage(message, currentUser, file, tags, geolocation, streetAddress, start, duration, interval, link).then((messageKey) => {
      addPublishMessagesKeyToUserProfile(currentUser,messageKey).then(() => {
        if (validateFile(file)) {
          // Upload Event Full Image
          imageResizer(file, 1280, 1280, "image/jpeg", 0.5, function(blob) {
            uploadImage(currentUser, messageKey, "event.jpg", blob).then((snapshot) =>  {
              var fullPath = snapshot.metadata.fullPath;
              var firebaseImageURL = firebase.storage().ref(fullPath).toString();
              firebase.storage().ref(fullPath).getDownloadURL().then((url) => {
                var publicImageURL = url;
                console.log('publicImageURL: ' + publicImageURL);
                return updateMessageImageURL(messageKey, firebaseImageURL, publicImageURL);
            });
          });
        });
      } else  {
        console.log("Not Image/No Image");
        // postFbMessage(fbpostmessage, geolocation, '', tags, messageKey);
      }
    })
  });
};

export default postMessage;
