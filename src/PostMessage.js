/*global FB*/
import * as firebase from 'firebase';
import config from './config/default';
import uuid from 'js-uuid';

function postFbMessage(message, geolocation, snapshot, data){
  var fbpost = "https://www.facebook.com/groups/OurLandHK/permalink/FeedID";
  var fbpostmessage = message + "\nGeo ("+ geolocation.longitude + "," + geolocation.latitude + ")\n#Testing";
  var imagePublicURL = "no update";
  var fullPath = NaN
  if(!isNaN(snapshot))
  {
    fullPath = snapshot.metadata.fullPath;  
    return firebase.storage().ref(fullPath).getDownloadURL().then((url) => {
      imagePublicURL = url;
      console.log('imagePublicURL: ' + imagePublicURL);
      return imagePublicURL;
    }).then((imagePublicURL) => {
      FB.login((response)=>{
      // Note: The call will only work if you accept the permission request
      console.log(response);
      console.log(imagePublicURL);
      FB.api(
        '/' + config.fbGroupId + '/photos',
        'post', 
        {
          url: imagePublicURL,
          message: fbpostmessage
        },
        (response) => {
          console.log(response);
          if (response && !response.error) {
            console.log('Post ID: ' + response.id);
            var fbphotopost = "https://www.facebook.com/photo.php?fbid=" + response.id;
            fbpost = fbphotopost;
            console.log('URL: ' + fbpost);
          } else {
            console.log('Error:' + response.error.message + ' code ' + response.error.code);
            console.log(fbpostmessage);
          }
        });
    }, {scope: 'publish_actions,user_managed_groups'});     
    }).then(() => {return data.update({fbpost: fbpost});});
  } else {
    FB.login((response)=>{
    // Note: The call will only work if you accept the permission request
      console.log(response);
      FB.api(
        '/' + config.fbGroupId + '/feed',
        'post', 
        {
          message: fbpostmessage
        },
        (response) => {
          console.log(response);
          if (response && !response.error) {
            console.log('Post ID: ' + response.id);
            var fbfeedpost = 'https://www.facebook.com/groups/' + config.fbGroupId + '/permalink/' + response.id.split("_")[1];              fbpost = fbfeedpost;
            console.log('URL: ' + fbpost);
          } else {
            console.log('Error:' + response.error.message + ' code ' + response.error.code);
            console.log(fbpostmessage);
          }
        });        
    }, {scope: 'publish_actions,user_managed_groups'}).then(() => {return data.update({fbpost: fbpost});})
  }
};

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


function postMessage(message, file, geolocation) {
  // Check if the file is an image.

  var loadingImageUrl = "https://www.google.com/images/spin-32.gif";
  var auth = firebase.auth();
  var currentUser = auth.currentUser;       
  var messagesRef = firebase.database().ref(config.messageDB);
  return messagesRef.push({
    name: currentUser.displayName,
    imageUrl: loadingImageUrl,
    text: message,
    photoUrl: currentUser.photoURL || '/images/profile_placeholder.png',
    latitude: geolocation.latitude,
    longitude: geolocation.longitude,
    createdAt: Date.now(),
    key: uuid.v4(),    
    fbpost: 'fbpost'
  }).then((data) => {
    if (! validateFile(file)) {
      console.log("Invalid file.");
      postFbMessage(message, geolocation, NaN, data);
    }
    else
    {    
      uploadImage(data, file).then(
        (snapshot) =>  {
          return updateData(data, snapshot).then(() =>
            {
              console.log("call fb");
              console.log(message);
              console.log(file);
              console.log(geolocation);
              console.log(snapshot);
              console.log(data);
              return postFbMessage(message, geolocation, snapshot, data);
            });
        });
    }
  });  
  this.messageInput.value = null;
};

export default postMessage;
