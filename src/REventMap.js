import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

// Using Map https://github.com/fullstackreact/google-maps-react

const style = {
  height: '100%',
  width: '100%'
}

const style2 = {
  height: '40vh',
  width:'100vw',
  position: 'relative'
}

export class EventMap extends Component {
  static defaultProps = {
    center: {lat: 22, lng: 114},
    zoom: 15,
}

render() {
    return (
      <CardMedia>
        <div style={style2}>
          <Map google={this.props.google}
            style={style}
            initialCenter={this.props.center}
            zoom={this.props.zoom}>
            <Marker position={this.props.center} />
          </Map>
        </div>
      </CardMedia>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDdPxqSdKSWLot9NS0yMD2CQtI1j4GF_Qo'
})(EventMap)
