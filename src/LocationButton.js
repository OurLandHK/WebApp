import React, { Component } from 'react';
import Button  from 'material-ui/Button';
import getLocation from './Location';
import geoString from './GeoLocationString';
import {connect} from "react-redux";
import {fetchLocation} from "./actions";
import { bindActionCreators } from 'redux';

class LocationButton extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const {fetchLocation, geoLocation} = this.props;
    const pos = geoLocation.pos;
    if (pos != null) {
      var locationString = geoString(pos.latitude, pos.longitude);
      return (
        <div>
          {locationString}
        </div>);      
    }
    else {
      return (
        <div>
          <Button raised primary={true} onClick={() => fetchLocation()}>取得現在位置</Button>
        </div>);
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    geoLocation : state.geoLocation,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLocation: () => dispatch(fetchLocation())
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(LocationButton);
