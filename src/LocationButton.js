import React, { Component } from 'react';
import { Form, Label, Input} from 'reactstrap';
import Button  from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import LocationIcon from '@material-ui/icons/LocationOn';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import {connect} from 'react-redux';
import geoString from './GeoLocationString';
import EventMap from './REventMap';
import RoleEnum from './config/default';

/*
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
  },
  showMapBtn: {
    width: '100%'
  },
  dialogContentWrapper: {
    flex: '1 1 auto'
  },
  geoDialogContent: {
    paddingLeft: '48px'
  }
});
class LocationButton extends Component {
  constructor(props) {
    super(props);
    this.geolocation = null;
    this.streetAddress = null;
    this.geoLocation = null;
    this.geoLocationSearch = {
      latitude: "",
      longitude: ""
    };

    if(this.props.geolocation  != null ) {
      this.geolocation = this.props.geolocation;
    }
    if(this.props.streetAddress  != null ) {
      this.streetAddress = this.props.streetAddress;
    }
    if(this.props.geoLocationSearch  != null ) {
      this.geoLocationSearch = {
        latitude: this.props.geoLocationSearch.latitude,
        longitude: this.props.geoLocationSearch.longitude
      };
    }
    this.state = {
      open: false,
      streetAddress: this.streetAddress,
      geoLocationSearch: this.geoLocationSearch,
      geolocation: this.geolocation,
      disableSumbit: true
    };
    this.disabled = false;
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.successCallBack = this.successCallBack.bind(this);
    this.geoSuccessCallBack = this.geoSuccessCallBack.bind(this);
    this.streetAddressSuccessCallBack = this.streetAddressSuccessCallBack.bind(this);
    this.geoLocationSuccessCallBack = this.geoLocationSuccessCallBack.bind(this);
    this.geoLocationSearchSuccessCallBack = this.geoLocationSearchSuccessCallBack.bind(this);
    this.notSupportedCallBack = this.notSupportedCallBack.bind(this);
    this.onMapCenterChange = this.onMapCenterChange.bind(this);
    console.log(this.state.geoLocationSearch)
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

  geoLocationSearchSuccessCallBack(err, response) {
     if (!err) {
      console.log(response.json.results);
      var pos = { coords:
            {
              latitude: response.json.results[0].geometry.location.lat,
              longitude: response.json.results[0].geometry.location.lng
            }
          };
      this.geoSuccessCallBack(pos);
    }
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

  onMapCenterChange(center){
    var pos = { coords:
          {
            latitude: center.lat(),
            longitude: center.lng()
          }
        };
    this.geoSuccessCallBack(pos);
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

   handleGetLocationFromGeoAddress() {
    this.setState({geolocation: null});
    if (this.disabled) {
      alert('Location not supported!');
    }
    else {
      getStreetAddressFromGeoLocation(this.state.geoLocationSearch, this.geoLocationSearchSuccessCallBack, this.errorCallBack);
    }
  }

  renderStreetAddressSearch() {
   const classes = this.props.classes;

   if( (this.state.geoLocationSearch.latitude === "" && this.state.geoLocationSearch.longitude === "") ){
    let streetAddressSearchClass = (this.state.streetAddress === null || this.state.streetAddress === "" ? "hide" : "");

    return (
      <div className={this.state.geolocation  != null  && classes.dialogContentWrapper}>
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
              <Button className={ streetAddressSearchClass + " " +  classes.showMapBtn} variant="outlined" color="primary" onClick={() => this.handleGetLocationFromStreetAddress()}>查看地圖</Button>
        </div>
    );
   } else {
    return (
        null
    );
   }
  }

  renderGeoLocationSearch() {
    const classes = this.props.classes;
    const user = this.props.user;

    if(user.userProfile  != null  && (user.userProfile.role === RoleEnum.advancedUser || user.userProfile.role === RoleEnum.admin)) {
      if (this.state.streetAddress === null || this.state.streetAddress === "" || (this.state.geoLocationSearch.latitude !== "" || this.state.geoLocationSearch.longitude !== "") ) {
           let geoLocationSearchClass = "";
          if(this.state.geoLocationSearch  != null ) {
            if( (this.state.geoLocationSearch.latitude === undefined || this.state.geoLocationSearch.latitude === '') || (this.state.geoLocationSearch.longitude === undefined || this.state.geoLocationSearch.longitude === '') ) {
              geoLocationSearchClass = "hide ";
            } else {
              geoLocationSearchClass = "";
            }
          }

          return (
            <div className={this.state.geolocation  != null  && classes.dialogContentWrapper}>
                <DialogContent className={classes.geoDialogContent}>
                 <TextField
                    fullWidth
                    id="geoLocationSearchLatitude"
                    placeholder="地理位置"
                    helperText="緯度"
                    type="text"
                    value={this.state.geoLocationSearch.latitude} onChange={event => this.setState({ geoLocationSearch: {latitude: event.target.value, longitude: this.state.geoLocationSearch.longitude}, disableSumbit: true,  geolocation: null})}
                  />
                  <TextField
                    fullWidth
                    id="geoLocationSearchLongitude"
                    placeholder="地理位置"
                    helperText="經度"
                    type="text"
                    value={this.state.geoLocationSearch.longitude} onChange={event => this.setState({ geoLocationSearch: {latitude: this.state.geoLocationSearch.latitude, longitude: event.target.value}, disableSumbit: true,  geolocation: null})}
                  />
               </DialogContent>
               <Button className={geoLocationSearchClass + " " +  classes.showMapBtn} variant="outlined" color="primary" onClick={() => this.handleGetLocationFromGeoAddress()}>查看Geo地圖</Button>
            </div>)
        } else {
          return (null);
        }
      } else {
        return (null);
      }
  }

  handleClickOpen = () => {
    this.geolocation = null;
    this.setState({ open: true, disableSumbit: true, geolocation: null});
  };

  handleClose = () => {
    this.setState({ open: false, disableSumbit: true, geolocation: null});
  };

  handleSubmit = () => {
    this.streetAddress = this.state.streetAddress;
    if(this.props.onSubmit  != null ) {
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
    if (pos  != null ) {
      geolocation = {lat: pos.latitude, lng: pos.longitude};
      if(this.state.streetAddress !== "" || this.state.geoLocationSearch !== "") {
        locationString = "位置: " + this.state.streetAddress + "\n(" + geoString(pos.latitude, pos.longitude) + ")";
      }else if(this.state.geoLocationSearch.latitude !== "" || this.state.geoLocationSearch.longitude !== "") {
        locationString = "位置: " + this.state.streetAddress + "\n(" + geoString(pos.latitude, pos.longitude) + ")";
      }else {
        locationString = "位置: 近" + geoString(pos.latitude, pos.longitude);
      }


    }


    return (
      <React.Fragment>
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
          {this.renderStreetAddressSearch()}
          {this.renderGeoLocationSearch()}
          <p>{locationString}</p>
          {this.state.geolocation  != null   && <EventMap center={geolocation} zoom={zoom} onCenterChange={this.onMapCenterChange}/>}
        </Dialog>

      </React.Fragment>);
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
  };
}


export default connect(
  mapStateToProps
)
(withStyles(styles)((LocationButton)));
