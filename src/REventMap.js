import React, { Component } from 'react';
import { compose, withProps, withHandlers } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import CardMedia from '@material-ui/core/CardMedia';

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
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(pos, zoom) {
    if (this.props.onCenterChange !== undefined)
      this.props.onCenterChange(pos, zoom);
  }

  render() {
    const MyMapComponent = compose(
      withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDdPxqSdKSWLot9NS0yMD2CQtI1j4GF_Qo&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `40vh` }} />,
        mapElement: <div style={{ height: `100%` }} />,
      }),
      withHandlers(() => {
        const refs = {
          map: undefined,
        }

        return {
          onDragEnd: () => () => {
            let pos = refs.map.getCenter();
            let zoom = refs.map.getZoom();
            this.onDragEnd(pos, zoom);
          },
          onMapMounted: () => ref => {
            refs.map = ref
          }
        }
      }),
      withScriptjs,
      withGoogleMap
    )((props) =>
      <GoogleMap
        defaultZoom={this.props.zoom}
        defaultCenter={this.props.center}
        ref={props.onMapMounted}
        onDragEnd={props.onDragEnd}
        options={{streetViewControl: false}}
      >
        <Marker position={this.props.center} />
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
