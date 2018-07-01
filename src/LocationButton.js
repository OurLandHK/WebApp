import React, { Component } from 'react';
import Button  from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Form, Label, Input} from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import LocationIcon from '@material-ui/icons/LocationOn';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import geoString from './GeoLocationString';
import Slide from '@material-ui/core/Slide';
import EventMap from './REventMap';
import { withStyles } from '@material-ui/core/styles';

/*
import {connect} from "react-redux";
import {fetchLocation} from "./actions";
import {bindActionCreators } from 'redux';
*/
import {getCurrentLocation, getGeoLocationFromStreetAddress, getStreetAddressFromGeoLocation} from './Location';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => ({
  flex: {
    flex: 1,
  },  
  dialogTitle: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'  
  }
});
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
    if(this.props.onSubmit != null) {
      console.log("this.props.onSubmit call");
      this.props.onSubmit(this.geolocation, this.streetAddress);
    }
    console.log("handleSubmit:" + this.streetAddress);
    this.setState({ open: false });
  };


  render() {
    //const {fetchLocation, geoLocation} = this.props;
    const zoom=15;
    const pos = this.state.geolocation;
    const classes = this.props.classes;
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
          輸入地點
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
          <DialogTitle id="form-dialog-title" className="dialog-title">使用所在位置 / 輸入地址</DialogTitle>
          <AppBar className={classes.dialogTitle}>
            <Toolbar>
              <IconButton color="contrast" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>  </Typography>
              <Button variant="raised" color="primary"disabled={this.state.disableSumbit} onClick={this.handleSubmit} >
              使用所在位置 / 輸入地址
              </Button>
            </Toolbar>
          </AppBar>
          <DialogContent className="address-row">
            <MyLocationIcon onClick={() => this.handleGetLocation()} />
            <TextField
              autoFocus
              fullWidth
              id="stressAddress"
              placeholder="街道地址"
              helperText="中/英文均可"
              type="text"
              value={this.state.streetAddress} onChange={event => this.setState({ streetAddress: event.target.value, disableSumbit: true,  geolocation: null})}
            />            
          </DialogContent>
          <Button className={this.state.streetAddress === null || this.state.streetAddress === "" ? "hide" : ""} variant="outlined" color="primary" onClick={() => this.handleGetLocationFromStreetAddress()}>查看地圖</Button>
          <p>{locationString}</p>
          {this.state.geolocation != null  && <EventMap center={geolocation} zoom={zoom}/>}
        </Dialog>

      </div>);
  }
}

export default withStyles(styles)(LocationButton);
