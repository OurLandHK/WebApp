import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

// Using Map https://github.com/fullstackreact/google-maps-react

const style = {
  width: '100%',
  height: '30%'
}

export class EventMap extends Component {
  static defaultProps = {
    center: {lat: 22, lng: 114},
    zoom: 15,
}

render() {
    return (
      <Map google={this.props.google}
        style={style}
        initialCenter={this.props.center}
        zoom={this.props.zoom}>
        <Marker position={this.props.center} />
      </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: 'AIzaSyDdPxqSdKSWLot9NS0yMD2CQtI1j4GF_Qo'
})(EventMap)