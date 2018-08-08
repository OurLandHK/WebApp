import React, { Component } from 'react';
import { compose, withProps, withState, withHandlers } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

// Using Map https://github.com/fullstackreact/google-maps-react

const style = {
  height: '100%',
  width: '100%'
}

export class EventMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: this.props.center,
      zoom: this.props.zoom
    };
    // this.setState({
    //   center: this.props.center,
    //   zoom: this.props.zoom
    // });
    this.onMapClicked = this.onMapClicked.bind(this);
  }

  onMapClicked(mapProps, map, clickEvent) {
    console.log('mapProps', mapProps)
    let newPosSet = { lat: clickEvent.latLng.lat(), lng: clickEvent.latLng.lng() };
    this.state.center = newPosSet;
    mapProps.google.maps.Marker;
  }

  render() {
    const MyMapComponent = compose(
      withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDdPxqSdKSWLot9NS0yMD2CQtI1j4GF_Qo&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `40vh` }} />,
        mapElement: <div style={{ height: `100%` }} />,
      }),
      withState('zoom', 'onZoomChange', 8),
      withHandlers(() => {
        const refs = {
          map: undefined,
        }

        return {
          onMapMounted: () => ref => {
            refs.map = ref
          },
          onClick: (wt) => {
            console.log(refs.map.getCenter())
          },
          onZoomChanged: ({ onZoomChange }) => () => {
            onZoomChange(refs.map.getZoom())
          }
        }
      }),
      withScriptjs,
      withGoogleMap
    )((props) =>
      <GoogleMap
        defaultZoom={this.props.zoom}
        defaultCenter={this.props.center}
      >
        <Marker position={this.props.center} onClick={props.onMarkerClick} />
      </GoogleMap>
    );
    return (
      <CardMedia className="map-wrapper">
        <MyMapComponent />
      </CardMedia>
    );
  }
}

export default EventMap
