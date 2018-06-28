import React, { Component } from 'react';
import Button  from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import LocationIcon from '@material-ui/icons/LocationOn';
import geoString from './GeoLocationString';
import Slide from '@material-ui/core/Slide';
import EventMap from './REventMap';
/*
import {connect} from "react-redux";
import {fetchLocation} from "./actions";
import {bindActionCreators } from 'redux';
*/
import {getCurrentLocation, getGeoLocationFromStreetAddress, getStreetAddressFromGeoLocation} from './Location';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}
class LocationButton extends Component {
  constructor(props) {
    super(props);
    this.geolocation = null;
    this.streetAddress = null;
    if(this.props.geolocation != null) {
      this.geolocation = this.props.geolocation;
    }
    if(this.props.streetAddress != null) {
      this.streetAddress = this.props.streetAddress;
    }
    this.state = {open: false, streetAddress: this.streetAddress, geolocation: this.geolocation, disableSumbit: true};
    this.disabled = false;
    this.successCallBack = this.successCallBack.bind(this);
    this.geoSuccessCallBack = this.geoSuccessCallBack.bind(this);
    this.streetAddressSuccessCallBack = this.streetAddressSuccessCallBack.bind(this);
    this.geoLocationSuccessCallBack = this.geoLocationSuccessCallBack.bind(this);
    this.notSupportedCallBack = this.notSupportedCallBack.bind(this);
  }

  notSupportedCallBack() {
    this.disabled = true;
    console.log('Disabled');
  }

  geoSuccessCallBack(pos) {
    console.log("geoSccessCallBack " +pos.coords.latitude  + pos.coords.longitude);
    this.tempGeolocation = pos; 
    getStreetAddressFromGeoLocation(pos.coords, this.geoLocationSuccessCallBack, this.errorCallBack);
   
  }

  geoLocationSuccessCallBack(err, response) {
    if (!err) {
      console.log(response.json.results);
      this.state.streetAddress = response.json.results[0].formatted_address;
      this.successCallBack(this.tempGeolocation);
    }
  }

  successCallBack(pos) {
    this.geolocation = pos.coords;
    console.log("geoSccessCallBack " + this.geolocation.latitude + this.geolocation.longitude);
    
    this.setState({geolocation: pos.coords, disableSumbit: false});
  }



  streetAddressSuccessCallBack(err, response) {
    if (!err) {
      console.log(response.json.results);
      var pos = { coords: 
                  {
                    latitude: response.json.results[0].geometry.location.lat,
                    longitude: response.json.results[0].geometry.location.lng
                  }
                };
      this.successCallBack(pos);
    }
  }

  errorCallBack(error) {
    console.warn('ERROR(${err.code}): ${err.message}');
  }

  handleGetLocation() {
    this.setState({geolocation: null});
    if (this.disabled) {
      alert('Location not supported!');
    }
    else {
      getCurrentLocation(this.geoSuccessCallBack, this.errorCallBack, this.notSupportedCallback);
    }
  }

  handleGetLocationFromStreetAddress() {
    this.setState({geolocation: null});
    if (this.disabled) {
      alert('Location not supported!');
    }
    else {
      getGeoLocationFromStreetAddress(this.state.streetAddress, this.streetAddressSuccessCallBack, this.errorCallBack);
    }
  }
  

  rest() {

  }

  handleClickOpen = () => {
    this.geolocation = null;
    this.setState({ open: true, disableSumbit: true, geolocation: null});
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    this.streetAddress = this.state.streetAddress;
    console.log("handleSubmit:" + this.streetAddress);
    this.setState({ open: false });
  };
  

  render() {
    //const {fetchLocation, geoLocation} = this.props;
    const zoom=15;
    const pos = this.state.geolocation;
    let geolocation = null;
    let locationString = null;
    if (pos != null) {
      geolocation = {lat: pos.latitude, lng: pos.longitude};
      if(this.state.streetAddress != "") {
        locationString = "位置: " + this.state.streetAddress + "\n(" + geoString(pos.latitude, pos.longitude) + ")";
      } else {
        locationString = "位置: 近" + geoString(pos.latitude, pos.longitude);   
      }  
    }
    return (
      <div>
        <Button
          variant="raised"
          color="secondary"
          onClick={this.handleClickOpen}>
          <LocationIcon />
          輸入位置
        </Button>
        &nbsp;
        {locationString}
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          transition={Transition}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">輸入位置</DialogTitle>
          <DialogContent>
            <DialogContentText>
              請輸入街道地址或使用您當前的位置
            </DialogContentText>
            <Button variant="outlined" color="primary"  onClick={() => this.handleGetLocation()}>使用您當前的位置</Button> 
            <DialogContentText>
              或
            </DialogContentText> 
            <DialogContentText>
              請輸入街道地址或使用您當前的位置
            </DialogContentText>            
            <TextField
              autoFocus
              fullWidth
              id="stressAddress"
              label="街道地址"
              helperText="中/英文均可"
              type="text"
              fullWidth
              value={this.state.streetAddress} onChange={event => this.setState({ streetAddress: event.target.value, disableSumbit: true,  geolocation: null})}
            />
            <Button variant="outlined" color="primary"  onClick={() => this.handleGetLocationFromStreetAddress()}>驗證街道地址</Button>
          </DialogContent>
          {locationString}
          <DialogActions>
            <Button variant="raised" color="secondary" onClick={this.handleClose} >
              取消
            </Button>
            <Button variant="raised" color="primary" disabled={this.state.disableSumbit} onClick={this.handleSubmit} >
              提交
            </Button>
          </DialogActions>
          {this.state.geolocation != null  && <EventMap center={geolocation} zoom={zoom}/>}
        </Dialog>        
         
      </div>);
  }
}

export default LocationButton;
