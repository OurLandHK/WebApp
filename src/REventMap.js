import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

// Using Map https://github.com/fullstackreact/google-maps-react

const style = {
  height: '100%',
  width: '100%'
}

const style2 = {
  height: '30vh',
  width:'70vw',
  border: '1px solid black',
  position: 'relative'
}

export class EventMap extends Component {
  static defaultProps = {
    center: {lat: 22, lng: 114},
    zoom: 15,
}

render() {
    return (
      <div style={style2}>
        <Map google={this.props.google}
          style={style}
          initialCenter={this.props.center}
          zoom={this.props.zoom}>
          <Marker position={this.props.center} />
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDdPxqSdKSWLot9NS0yMD2CQtI1j4GF_Qo'
})(EventMap)
