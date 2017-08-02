import { Button } from 'reactstrap';
import React, { Component } from 'react';
import getLocation from './Location';

class LocationButton extends Component {
  constructor(props) {
    super(props);
    this.disabled = false;
  }

  notSupportedCallBack() {
    this.disabled = true;
    console.log('Disabled');
  }

  successCallBack(pos) {
    console.log('Your current position is:');
    console.log('Latitude : ' + pos.coords.latitude);
    console.log('Longitude: ' + pos.coords.longitude);
    console.log('More or less ' + pos.coords.accuracy + 'meters.');  
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
    return (<Button color="primary" onClick={() => this.handleGetLocation()}>Location</Button>);
  }
}

export default LocationButton;
