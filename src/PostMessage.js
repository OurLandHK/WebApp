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
  var filePath = config.photoDB + '/' + messageKey + '/' + filename;
  var storage = firebase.storage();
  return storage.ref(filePath).put(blob);  
};


function postMessage(key, message,tags, geolocation, streetAddress, start, duration, interval, link, imageUrl, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL, status) {
  var auth = firebase.auth();
  var currentUser = auth.currentUser;     
  var mapString = "\nhttps://www.google.com.hk/maps/place/"+ geoString(geolocation.latitude, geolocation.longitude) + "/@" + geolocation.latitude + "," + geolocation.longitude + ",18z/";
  return addMessage(key, message, currentUser, tags, geolocation, streetAddress,
    // activites 
    start, duration, interval, link, 
    // images
    imageUrl, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL,
    status).then((messageKey) => {
    return messageKey;
  });
};

export default postMessage;
