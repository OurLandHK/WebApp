function getCurrentLocation(successCallBack, errorCallBack, notSupportedCallBack) {
  if(navigator.geolocation) {
   var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }; 
    navigator.geolocation.getCurrentPosition(successCallBack, errorCallBack, options);
  } else {
    notSupportedCallBack();
  }
} 

function getGeoLocationFromStreetAddress(streetAddress, successCallBack, errorCallBack) {
  var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDdPxqSdKSWLot9NS0yMD2CQtI1j4GF_Qo'
  });
  googleMapsClient.geocode({
    address: streetAddress,
    region: 'hk'
  }, successCallBack);
}






export {getCurrentLocation, getGeoLocationFromStreetAddress};
