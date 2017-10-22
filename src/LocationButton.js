import React, { Component } from 'react';
import Button  from 'material-ui/Button';
import getLocation from './Location';
import geoString from './GeoLocationString';

class LocationButton extends Component {
  constructor(props) {
    super(props);
    this.state = {geolocation: null};
    this.geolocation = null
    this.disabled = false;
    this.successCallBack = this.successCallBack.bind(this);
  }

  notSupportedCallBack() {
    this.disabled = true;
    console.log('Disabled');
  }

  successCallBack(pos) {
    this.geolocation = pos.coords;
    this.setState({geolocation: pos.coords});
    console.log('Your current position is:');
    console.log('Geo String: ' + geoString(this.geolocation.longitude, this.geolocation.latitude))
    console.log('this.geolocation: ' + JSON.stringify(this.geolocation));
  }

  errorCallBack(error) {
    console.warn('ERROR(${err.code}): ${err.message}');
  }

  handleGetLocation() {
    if (this.disabled) {
      alert('Location not supported!');
    }
    else {
      getLocation(this.successCallBack, this.errorCallBack, this.notSupportedCallback);
    }
  }


  render() {
    if(this.state.geolocation != null) {
      var locationString = geoString(this.geolocation.longitude, this.geolocation.latitude);
      return (
        <div>
          {locationString}
        </div>);      
    }
    else {
      return (
        <div>
          <Button raised primary={true} onClick={() => this.handleGetLocation()}>取得現在位置</Button>
        </div>);
    }
  }
}

export default LocationButton;
