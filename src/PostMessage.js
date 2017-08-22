import * as firebase from 'firebase';
import config from './config/default';
import postFbMessage from './FacebookPost';
import uuid from 'js-uuid';



function validateFile(file) {
  if (! file || !file.type.match('image.*')) {
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

function uploadImage(data, file) {
  var auth = firebase.auth();
  var currentUser = auth.currentUser;
  var filePath = currentUser.uid + '/' + data.key + '/' + file.name;
  var storage = firebase.storage();
  return storage.ref(filePath).put(file);
};

function updateData(data, snapshot) {
  var fullPath = snapshot.metadata.fullPath;
  return data.update({imageUrl: firebase.storage().ref(fullPath).toString()});
};


function postMessage(message, file, tags, geolocation) {
  // Check if the file is an image.

  //var loadingImageUrl = "https://www.google.com/images/spin-32.gif";
  var auth = firebase.auth();
  var currentUser = auth.currentUser;       
  var messagesRef = firebase.database().ref(config.messageDB);
  return messagesRef.push({
    name: currentUser.displayName,
    //imageUrl: loadingImageUrl,
    text: message,
    photoUrl: currentUser.photoURL || '/images/profile_placeholder.png',
    latitude: geolocation.latitude,
    longitude: geolocation.longitude,
    tag: tags,
    createdAt: Date.now(),
    key: uuid.v4(),    
    fbpost: 'fbpost'
  }).then((data) => {
    var tagsLength = tags.length;
    var tagString = '';
    for (var i = 0; i < tagsLength; i++) {
        tagString += "\n#"+tags[i];
    }
    var fbpostmessage = message + "\nGeo ("+ geolocation.longitude + "," + geolocation.latitude + ")" + tagString;
    if (! validateFile(file)) {
      console.log("Invalid file.");
      postFbMessage(fbpostmessage, geolocation, '', tags, data);
    }
    else
    {    
      uploadImage(data, file).then(
        (snapshot) =>  {
          return updateData(data, snapshot).then(() =>
            {
              postFbMessage(fbpostmessage, geolocation, snapshot, tags,data);
            });
        });
    }
  });  
};

export default postMessage;
