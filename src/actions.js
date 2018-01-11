import {FETCH_USER, DISABLE_LOCATION, FETCH_LOCATION} from './actions/types';
import * as firebase from 'firebase';

function receiveLocation(pos){
  return {type: FETCH_LOCATION, geoLocation: pos};
}

function disableLocation() {
  return {type: DISABLE_LOCATION};
}

function fetchUser(user) {
  return {type: FETCH_USER, user: user};
}

export function fetchLocation() {
  return dispatch => {
    if(navigator.geolocation) {
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }; 
      navigator.geolocation.getCurrentPosition((geoLocation) => {
        console.log(geoLocation);
        dispatch(receiveLocation(geoLocation));
      },
      (error) => {
        console.log(error);
      }, options);
    } else {
      alert('Location not supported!');
      dispatch(disableLocation())
    }
  }
}

export function checkAuthState() {
  return dispatch => {
    var auth = firebase.auth();
    auth.onAuthStateChanged((user) => {
      console.log(user);
      console.log('user');
      dispatch(fetchUser(user));
    });
  };
}

export function signIn() {
  return dispatch => {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_friends');
    provider.addScope('publish_actions');
    provider.addScope('user_managed_groups');
    provider.addScope('user_birthday');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      console.log(result.additionalUserInfo.profile);
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
    });
  };
}

export function signOut() {
  return dispatch => {
    firebase.auth().signOut();
    dispatch(fetchUser(null)); 
  }
}
