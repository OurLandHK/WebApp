import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

// Using Map https://github.com/fullstackreact/google-maps-react
 
export class EventMap extends Component {
  static defaultProps = {
    center: {lat: 22, lng: 114},
    zoom: 14,
}

render() {
    return (
      <Map google={this.props.google}
        initialCenter={this.props.center}
        zoom={this.props.zoom}
        outerHeight={window.innerHeight/3}>
        <Marker position={this.props.center} />
      </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: 'AIzaSyDdPxqSdKSWLot9NS0yMD2CQtI1j4GF_Qo'
})(EventMap)