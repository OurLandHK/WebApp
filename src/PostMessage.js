import * as firebase from 'firebase';
import config from './config/default';
import postFbMessage from './FacebookPost';
import {addPublishMessagesKeyToUserProfile} from './UserProfile';
import {addMessage, updateMessageImageURL} from './MessageDB';


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

function uploadImage(currentUser, messageKey, file) {

//  var Jimp = require("jimp");
  var filePath = currentUser.uid + '/' + messageKey + '/' + file.name;
  var storage = firebase.storage();

/*
  return Jimp.read(file.name).then(function (image) {
      var smallPicName = 'small' + file.name;
      image.resize(960, Jimp.AUTO, Jimp.RESIZE_BICUBIC).write(smallPicName); // save 
      var smallPic = new File(smallPicName);
      return storage.ref(filePath).put(smallPic);
  }).catch(function (err) {
      console.error(err);
      return storage.ref(filePath).put(file);                
  })
*/
  return storage.ref(filePath).put(file);                
};


function postMessage(message, file, tags, geolocation, start, duration, interval, link) {
  var auth = firebase.auth();
  var currentUser = auth.currentUser;       
  addMessage(message, currentUser, file, tags, geolocation, start, duration, interval, link).then((messageKey) => {
    addPublishMessagesKeyToUserProfile(currentUser,messageKey).then(() => {
      var fbpostmessage = message;
      if (! validateFile(file)) {
        console.log("Invalid file.");
        // postFbMessage(fbpostmessage, geolocation, '', tags, messageKey);
      }
      else
      {    
        uploadImage(currentUser, messageKey, file).then(
          (snapshot) =>  {
            var fullPath = snapshot.metadata.fullPath;
            var imageURL = firebase.storage().ref(fullPath).toString();
            return updateMessageImageURL(messageKey, imageURL);
          });
      }
    })
  });
};

export default postMessage;
