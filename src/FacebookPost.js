/*global FB*/
import * as firebase from 'firebase';
import config from './config/default';

export function postFbMessage(fbpostmessage, geolocation, data){
  var fbpost = "https://www.facebook.com/groups/OurLandHK/permalink/FeedID";
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
          fbpost = 'https://www.facebook.com/groups/' + config.fbGroupId + '/permalink/' + response.id.split("_")[1];
          console.log('URL: ' + fbpost);
          data.update({fbpost: fbpost});
        } else {
          console.log('Error:' + response.error.message + ' code ' + response.error.code);
          console.log(fbpostmessage);
        }
      });        
  }, {scope: 'publish_actions,user_managed_groups'});
};

export function postFbPhotoMessage(fbpostmessage, geolocation, snapshot, data){
  var fbpost = "https://www.facebook.com/groups/OurLandHK/permalink/FeedID";
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
            message: fbpostmessage
          },
          (response) => {
            console.log(response);
            if (response && !response.error) {
              console.log('Post ID: ' + response.id);
              fbpost = "https://www.facebook.com/photo.php?fbid=" + response.id;
              console.log('URL: ' + fbpost);
              data.update({fbpost: fbpost});
            } else {
              console.log('Error:' + response.error.message + ' code ' + response.error.code);
              console.log(fbpostmessage);
            }
          });
      }, {scope: 'publish_actions,user_managed_groups'});     
    });
};

export default postMessage;
