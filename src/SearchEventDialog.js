import React from 'react';
import {constant} from './config/default';
import Dialog from '@material-ui/core/Dialog';
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
      background: 'linear-gradient(to bottom, #006fbf  50%, #014880 50%)',
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
    signButton: {
      fontWeight: 'bold',
      display: 'inline-block',
      margin: theme.spacing.unit,
      textAlign: 'center',
      color: 'white',
      backgroundColor: '#006eb9',
      padding: '5px',
      border: '2px solid white',
      borderRadius: '2px',
      boxShadow: '0 0 0 3px #006eb9, 0 0 10px #aaa',
    },
    chip: {
      margin: theme.spacing.unit / 2,
    },
    title: {
      fontWeight: 'bold',
      textAlign: 'center',
      margin: '40px auto 10px'
    },
    searchInputIcon: {
      borderRadius: '10px',
      backgroundColor: theme.palette.common.white,
      border: '1px solid #ced4da',
    },
    searchInput: {
      borderRadius: '10px',
      backgroundColor: theme.palette.common.white,
      border: '1px solid #ced4da',
      flex: 1,
    },
    dialogTitle: {
      background: 'linear-gradient(to bottom, #006fbf  50%, #014880 50%)',
    }
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
    this.hotItemOnly = false;
    if(this.props.hotItemOnly) {
      this.hotItemOnly = true;
    }
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
      this.setState({
        streetAddress: response.json.results[0].formatted_address
      });
      this.successCallBack(this.tempGeolocation);
    }
  }

  errorCallBack(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  handleGetLocation() {
    this.setState({geolocation: null});
    (this.disabled)
      ?
        alert('Location not supported!')
      :
        getCurrentLocation(this.geoSuccessCallBack, this.errorCallBack, this.notSupportedCallback);
  }


  handleGetLocationFromStreetAddress() {
    this.setState({geolocation: null});
    (this.disabled)
      ?
        alert('Location not supported!')
      :
        getGeoLocationFromStreetAddress(this.state.streetAddress, this.streetAddressSuccessCallBack, this.errorCallBack);
  }

  renderStreetAddressSearch() {
   const classes = this.props.classes;

   if( (this.state.geoLocationSearch.latitude === "" && this.state.geoLocationSearch.longitude === "") ){
    //let streetAddressSearchClass = (this.state.streetAddress === null || this.state.streetAddress === "" ? "hide" : "");
    let disableSearch = (this.state.streetAddress === null || this.state.streetAddress === "" ? true : false);

    return (
      <React.Fragment>
        <MyLocationIcon className={classes.searchInputIcon} onClick={() => this.handleGetLocation()} />
          <TextField
            autoFocus
            fullWidth
            className={classes.searchInput}
            id="stressAddress"
            placeholder="街道地址(中/英文均可)"
            type="text"
            value={this.state.streetAddress} onChange={event => this.setState({ streetAddress: event.target.value, disableSumbit: true,  geolocation: null})}
          />
          <SearchIcon disabled={disableSearch} className={classes.searchInputIcon} onClick={() => this.handleGetLocationFromStreetAddress()} />
      </React.Fragment>
    );
   } else {
    return null;
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
      let id = constant.searchEventLabel + "Tag";
      return (<div className={classes.container}>
          <FilterBar isUsePublicAddressBook={true} filterID={id}/>
          <MessageList
            isUsePublicAddressBook={true}
            ref={(messageList) => {this.messageList = messageList;}}
            eventNumber={eventNumber}
            distance={distance}
            tagFilter={this.state.filter}
            id={id}
          />
        </div>);
    } else {
      let geo = {longitude: this.state.geolocation.longitude, latitude: this.state.geolocation.latitude};
      console.log(`${this.state.geolocation.longitude} ${this.state.geolocation.latitude}`)
      return (
        <div className={classes.container}>
          <FilterBar disableLocationDrawer={true} filterID={constant.searchEventLabel}/>
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
    let buttonList = [];
    for(let i = 0; i < TotalButton; i++) {
      let buttonHtml = <Button key={i} className={classes.signButton} aria-label={buttons[i].label}
                        onClick={(evt) => this.handleRequestOpen(evt, buttons[i].label, buttons[i].value)}>
                        {buttons[i].label}
                      </Button>
      buttonList.push(buttonHtml);
    }
    const cardImage = (
      <CardMedia
        image="/images/Dennis9.jpg"
        title={constant.regionEventLabel}>
        {constant.hotItemLabel}
        <Grid container className={classes.buttonGird}>
          {buttonList}
        </Grid>
      </CardMedia>
    );
    return cardImage;
  }

  render() {
    const { classes, open} = this.props;
    let messageHtml = null;
    let hotItemHtml = this.renderHotItem();

    if (this.state.open)  {
        messageHtml = this.renderMessages();
    }
    let titleLabel = (this.state.searchByTag)
      ?
        `${constant.searchEventLabel} - ${this.state.titleLabel}`
      :
        `${constant.searchEventLabel} - ${this.state.streetAddress}`;
    let controlWidget = hotItemHtml;
    if(!this.hotItemOnly) {
      controlWidget = <Dialog fullScreen open={open} onClose={this.handleClose} transition={Transition}  aria-labelledby="form-dialog-title">
                          <Toolbar className={classes.dialogTitle}>
                          <IconButton color="contrast" onClick={this.handleClose} aria-label="Close">
                              <CloseIcon />
                          </IconButton>
                              {this.renderStreetAddressSearch()}
                          </Toolbar>
                          {hotItemHtml}
                      </Dialog>
    }
    return (
          <React.Fragment>
            {controlWidget};
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
          </React.Fragment>);
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
