/*global FB*/
import React, { Component } from 'react';
import config, {constant} from './config/default';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import CardMedia from '@material-ui/core/CardMedia';
import SearchIcon from '@material-ui/icons/Search';
import MessageList from './MessageList';
import {connect} from "react-redux";
import { toggleSearchEventDialog, updateSearchEventLocation, updateFilterLocation } from './actions';
import FilterBar from './FilterBar';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import {getCurrentLocation, getGeoLocationFromStreetAddress, getStreetAddressFromGeoLocation} from './Location';
import TextField from '@material-ui/core/TextField';

import {trackEvent} from './track';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}


const styles = theme =>  ({
    appBar: {
      position: 'relative',
    },
    flex: {
      flex: 1,
    },
    buttonGird: {
      justify: 'center',
      flexGrow: 1
    },
    button: {
      flex: 1,
      padding: theme.spacing.unit,
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },    
    container: {
       overflowY: 'auto'
    },
    media: {
      color: '#fff',
      position: 'relative',
      height: '10rem',
    },
    mediaCredit: {
      position:'absolute',
      bottom:'0',
      right:'0',
      fontSize:'0.5rem',
    },
    showMapBtn: {
      borderRadius: 4,
      backgroundColor: theme.palette.common.white,
      border: '1px solid #ced4da',
      width: '100%'
    },
    chip: {
      margin: theme.spacing.unit / 2,
    },
    title: {
      fontWeight: 'bold',
      textAlign: 'center',
      margin: '40px auto 10px'
    },
    searchInput: {
      borderRadius: 4,
      backgroundColor: theme.palette.common.white,
      border: '1px solid #ced4da',
    }, 
  });

class SearchEventDialog extends React.Component {
  constructor(props) {
    super(props);
    this.geoLocationSearch = {
        latitude: "",
        longitude: ""
      };
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.onBackButtonEvent = this.onBackButtonEvent.bind(this);
    this.state = {
        eventNumber: this.props.eventNumber,
        distance: this.props.distance,
        geoLocationSearch: this.geoLocationSearch,
        filter: null,
        titleLabel: "",
        open: false,
    };
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

  successCallBack(pos) {
    this.geolocation = pos.coords;
    console.log("geoSccessCallBack " + this.geolocation.latitude + this.geolocation.longitude);
    this.props.updateSearchEventLocation(pos.coords);
    this.setState({geolocation: pos.coords, disableSumbit: false, open: true});
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

  geoLocationSuccessCallBack(err, response) {
    if (!err) {
      console.log(response.json.results);
      this.state.streetAddress = response.json.results[0].formatted_address;
      this.successCallBack(this.tempGeolocation);
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

  renderStreetAddressSearch() {
   const classes = this.props.classes;

   if( (this.state.geoLocationSearch.latitude === "" && this.state.geoLocationSearch.longitude === "") ){
    //let streetAddressSearchClass = (this.state.streetAddress === null || this.state.streetAddress === "" ? "hide" : "");
    let disableSearch = (this.state.streetAddress === null || this.state.streetAddress === "" ? true : false);

    return (
      <div className={this.state.geolocation  != null  && classes.dialogContentWrapper}>
        <DialogContent className="address-row">
          <MyLocationIcon className={classes.searchInput} onClick={() => this.handleGetLocation()} />
                <TextField
                  autoFocus
                  fullWidth
                  className={classes.searchInput} 
                  id="stressAddress"
                  placeholder="街道地址(中/英文均可)"
                  type="text"
                  value={this.state.streetAddress} onChange={event => this.setState({ streetAddress: event.target.value, disableSumbit: true,  geolocation: null})}
                />
          <SearchIcon disabled={disableSearch}className={classes.searchInput} onClick={() => this.handleGetLocationFromStreetAddress()} />
        </DialogContent>
      </div>
    );
   } else {
    return (
        null
    );
   }
  }

  handleRequestOpen(evt, titleLabel, filter) {
    evt.preventDefault();
    this.lastOnPopState = window.onpopstate;
    window.onpopstate = this.onBackButtonEvent;
    console.log(filter, titleLabel);
    trackEvent('Event', titleLabel);
    this.setState({filter: filter, titleLabel: titleLabel, searchByTag: true, open: true});
  }

  handleClose = () => { // this function is not called
    window.onpopstate = this.lastOnPopState;
    this.props.toggleSearchEventDialog(false);
  };

  handleRequestClose = () => { // this function is not called
    window.onpopstate = this.lastOnPopState;
    this.setState({filter: null, open: false, searchByTag: false});
  };

  onBackButtonEvent(e) {
    console.log("onBackButtonEvent Region" + JSON.stringify(e.state));
    e.preventDefault();
    this.handleRequestClose();
  }



  renderMessages() {
    const { classes, distance, eventNumber } = this.props;
    if(this.state.searchByTag) {
      return (<div className={classes.container}>
          <FilterBar isUsePublicAddressBook={true}/>
          <MessageList
            isUsePublicAddressBook={true}
            ref={(messageList) => {this.messageList = messageList;}}
            eventNumber={eventNumber}
            distance={distance}
            tagFilter={this.state.filter}
            id={constant.searchEventLabel}
          />
        </div>);
    } else {
      let geo = {longitude: this.state.geolocation.longitude, latitude: this.state.geolocation.latitude};
      console.log(`${this.state.geolocation.longitude} ${this.state.geolocation.latitude}`)
      return (
        <div className={classes.container}>
          <FilterBar disableLocationDrawer={true}/>
          <MessageList
            isUsePublicAddressBook={true}
            ref={(messageList) => {this.messageList = messageList;}}
            eventNumber={eventNumber}
            distance={distance}
            longitude={geo.longitude}
            latitude={geo.latitude}
            tagFilter={this.state.filter}
            id={constant.searchEventLabel}
          />
        </div>
      );
    }
  }

  renderHotItem() {
    const { classes, buttons } = this.props;
    const TotalButton = buttons.length;
    let buttonList1 = [];
    let buttonList2 = [];
    let firstLine = TotalButton/2 + TotalButton%2;
    for(let i = 0; i < TotalButton; i++) {
      let buttonHtml = <Button className={classes.button} variant="contained" size="small" aria-label={buttons[i].label}
          onClick={(evt) => this.handleRequestOpen(evt, buttons[i].label, buttons[i].value)}>
          {buttons[i].label}
          </Button>
      if(i<firstLine) {
        buttonList1.push(buttonHtml);
      } else {
        buttonList2.push(buttonHtml);
      }
    }
    const cardImage = (
      <CardMedia
        className={classes.media}
        image="/images/fromPeak.jpg"
        title={constant.regionEventLabel}
      >
        <Grid container >
          <Grid container className={classes.buttonGird}>
            {buttonList1}
          </Grid>
          <Grid container className={classes.buttonGird}>
            {buttonList2}
          </Grid>
        </Grid>
        <div
          className={classes.mediaCredit}
        >
        </div>
      </CardMedia>
    );
    return cardImage;
  }

  render() {
    const { classes, open} = this.props;
    let messageHtml = null;
    let hotItemHtml = this.renderHotItem();

    if(this.state.open)  {
        messageHtml = this.renderMessages();
    }
    let titleLabel = `${constant.searchEventLabel} - ${this.state.streetAddress}`;
    if(this.state.searchByTag) {
      titleLabel = `${constant.searchEventLabel} - ${this.state.titleLabel}`;
    }
    return (
        <div>
            <Dialog fullScreen open={open} onClose={this.handleClose} transition={Transition}  aria-labelledby="form-dialog-title">
                <Toolbar>
                <IconButton color="contrast" onClick={this.handleClose} aria-label="Close">
                    <CloseIcon />
                </IconButton>
                    {this.renderStreetAddressSearch()}
                </Toolbar>
                {hotItemHtml}
            </Dialog>
            <Dialog fullScreen onClose={this.handleRequestClose} open={this.state.open} >
                <AppBar className={classes.appBar} >
                    <Toolbar>
                        <IconButton onClick={this.handleRequestClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>{titleLabel}</Typography>
                    </Toolbar>
                </AppBar>
                {messageHtml}
            </Dialog>
        </div>);
  }
}

SearchEventDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    open: state.searchEventDialog.open,
    geolocation: state.searchEventDialog.geolocation,
    eventNumber: state.searchEventDialog.eventNumber,
    distance: state.searchEventDialog.distance,
    buttons: state.regionEventDialog.buttons,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSearchEventDialog: flag =>
      dispatch(toggleSearchEventDialog(flag)),
    updateSearchEventLocation: geolocation => 
      dispatch(updateSearchEventLocation(geolocation)),
    updateFilterLocation:
      (geolocation, distance) =>
        dispatch(updateFilterLocation(geolocation, distance)),      
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SearchEventDialog));
