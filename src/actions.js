import {
  UPDATE_FILTER,
  UPDATE_FILTER_LOCATION,
  FETCH_USER,
  DISABLE_LOCATION,
  FETCH_LOCATION
} from './actions/types';
import * as firebase from 'firebase';
import {getUserProfile} from './UserProfile';

const currentLocationLabel = "現在位置";
const officeLocationLabel = "辦公室位置";
const homeLocationLabel = "屋企位置";

function receiveLocation(pos, label=currentLocationLabel){
  return {type: FETCH_LOCATION, geoLocation: pos, label: label};
}

function disableLocation() {
  return {type: DISABLE_LOCATION};
}

function fetchUser(user, loading=false) {
  return {type: FETCH_USER, user: user, loading: loading};
}

function dispatchFilter(eventNumber, distance, geolocation) {
  return {type: UPDATE_FILTER, eventNumber: eventNumber, geolocation: geolocation, distance: distance}
}

function dispatchFilterLocation(geolocation) {
  return {type: UPDATE_FILTER_LOCATION, geolocation: geolocation};
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
    dispatch(fetchUser(null, true));
    auth.onAuthStateChanged((user) => {
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

export function setHomeLocation() {
  return dispatch => {
    var auth = firebase.auth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        getUserProfile(user).then((userProfile)=>{
          dispatch(receiveLocation(
            { latitiude: userProfile.homeLocationLongitude,
              longitude: userProfile.homeLocationLatitude },
            homeLocationLabel));
        });
      }
    });
  }
}

export function setOfficeLocation() {
  return dispatch => {
    var auth = firebase.auth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        getUserProfile(user).then((userProfile)=>{
          dispatch(receiveLocation(
            { latitiude: userProfile.officeLocationLongitude,
              longitude: userProfile.officeLocationLatitude },
            officeLocationLabel));
        });
      }
    });
  }
}

export function updateFilter(eventNumber, distance, geolocation) {
  return dispatch => {
    dispatch(dispatchFilter(eventNumber, distance, geolocation));
  };
}

export function updateFilterLocation(geolocation) {
  return dispatch => {
    dispatch(dispatchFilterLocation(geolocation));
  };
}
