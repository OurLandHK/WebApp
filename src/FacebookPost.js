/*global FB*/
import * as firebase from 'firebase';
import config from './config/default';
import geoString from './GeoLocationString';
import {addMessageFB_Post} from './MessageDB';


function postFbMessage(fbpostmessage, geolocation, snapshot, tags, messageKey){
    var tagsLength = tags.length;
    var tagString = '';
    for (var i = 0; i < tagsLength; i++) {
      tagString += "\n#"+tags[i];
    }
    if(snapshot === '') {
        postFbTextMessage(fbpostmessage + tagString, geolocation, tags, messageKey);
    }else{
        postFbPhotoMessage(fbpostmessage + tagString, geolocation, snapshot, tags, messageKey);
    }

}

function postFbTextMessage(fbpostmessage, geolocation, tags, messageKey){
  var fbpost = "";
  var mapString = "https://www.google.com.hk/maps/place/"+ geoString(geolocation.latitude, geolocation.longitude) + "/@" + geolocation.latitude + "," + geolocation.longitude + ",18z/"
  
  FB.login((response)=>{
  // Note: The call will only work if you accept the permission request
    console.log(response);
    FB.api(
      '/' + config.fbGroupId + '/feed',
      'post', 
      {
        message: fbpostmessage,
        link: mapString
      },
      (response) => {
        console.log(response);
        if (response && !response.error) {
          console.log('Post ID: ' + response.id);
          fbpost = '/groups/' + config.fbGroupId + '/permalink/' + response.id.split("_")[1];
          console.log('URL: ' + fbpost);
          addMessageFB_Post(messageKey, fbpost);
        } else {
          console.log('Error:' + response.error.message + ' code ' + response.error.code);
          console.log(fbpostmessage);
        }
      });        
  }, {scope: 'publish_actions,user_managed_groups'});
};

function postFbPhotoMessage(fbpostmessage, geolocation, snapshot, tags, messageKey){
  var fbpost = "";
  var mapString = "\nhttps://www.google.com.hk/maps/place/"+ geoString(geolocation.latitude, geolocation.longitude) + "/@" + geolocation.latitude + "," + geolocation.longitude + ",18z/"  
  var imagePublicURL = "no update";
  var fullPath = NaN
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
            message: fbpostmessage + mapString,
          },
          (response) => {
            console.log(response);
            if (response && !response.error) {
              console.log('Post ID: ' + response.id);
              fbpost = "/photo.php?fbid=" + response.id;
              console.log('URL: ' + fbpost);
              addMessageFB_Post(messageKey, fbpost);
            } else {
              console.log('Error:' + response.error.message + ' code ' + response.error.code);
              console.log(fbpostmessage);
            }
          });
      }, {scope: 'publish_actions,user_managed_groups'});     
    });
};

export default postFbMessage;
