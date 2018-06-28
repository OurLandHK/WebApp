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
  let googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDdPxqSdKSWLot9NS0yMD2CQtI1j4GF_Qo'
  });
  googleMapsClient.geocode({
    address: streetAddress,
    region: 'hk'
  }, successCallBack);
}

function getStreetAddressFromGeoLocation(geocode, successCallBack, errorCallBack) {
  let googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDdPxqSdKSWLot9NS0yMD2CQtI1j4GF_Qo'
  });
  let latlng = {lat: parseFloat(geocode.latitude), lng: parseFloat(geocode.longitude)};
  console.log(`Lat Lng ${latlng.lat} ${latlng.lng}`);
  googleMapsClient.reverseGeocode({
    latlng: [latlng.lat, latlng.lng],
    language: 'zh-TW'
  }, successCallBack);  
}





export {getCurrentLocation, getGeoLocationFromStreetAddress, getStreetAddressFromGeoLocation};
