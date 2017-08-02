function getLocation(successCallBack, errorCallBack, notSupportedCallBack) {
  console.log('Your current position is:');
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

export default getLocation;
