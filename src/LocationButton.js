import React, { Component } from 'react';
import Button  from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import geoString from './GeoLocationString';
import {connect} from "react-redux";
import {fetchLocation} from "./actions";
import { bindActionCreators } from 'redux';
import getLocation from './Location';

class LocationButton extends Component {
  constructor(props) {
    super(props);
    this.state = {open: false, streetAddress: "",};
    this.disabled = false;
    this.successCallBack = this.successCallBack.bind(this);
    this.notSupportedCallBack = this.notSupportedCallBack.bind(this);
  }

  notSupportedCallBack() {
    this.disabled = true;
    console.log('Disabled');
  }

  successCallBack(pos) {
    this.geolocation = pos.coords;
    this.setState({geolocation: pos.coords});
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

  rest() {

  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  

  render() {
    const {fetchLocation, geoLocation} = this.props;
    const pos = geoLocation.pos;
    let locationString = null;
    if (pos != null) {
      if(this.state.streetAddress != "") {
        locationString = "位置: " + this.state.streetAddress;
      } else {
        locationString = "位置: " + geoString(pos.latitude, pos.longitude);   
      }  
    }
    return (
      <div>
        {locationString}
        <Button onClick={this.handleClickOpen}>輸入位置</Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">輸入位置</DialogTitle>
          <DialogContent>
            <DialogContentText>
              請輸入街道地址或使用您當前的位置
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="stressAddress"
              label="街道地址"
              type="text"
              fullWidth
              value={this.state.streetAddress} onChange={event => this.setState({ streetAddress: event.target.value })}
            />
            <Button variant="raised" primary={true} onClick={() => this.handleGetLocation()}>驗證街道地址</Button>
            <Button variant="raised" primary={true} onClick={() => fetchLocation()}>使用您當前的位置</Button> {locationString}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Subscribe
            </Button>
          </DialogActions>
        </Dialog>        
         
      </div>);
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
