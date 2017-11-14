function getLocation(successCallBack, errorCallBack, notSupportedCallBack) {
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
