import {DISABLE_LOCATION, FETCH_LOCATION} from './actions/types';


function receiveLocation(pos){
  return {type: FETCH_LOCATION, geoLocation: pos};
}

function disableLocation() {
  return {type: DISABLE_LOCATION};
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
