import React from 'react';
import * as firebase from 'firebase';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import classnames from 'classnames';
import Chip from 'material-ui/Chip';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import NearMeIcon from 'material-ui-icons/NearMe';
import AddLocationIcon from 'material-ui-icons/AddLocation';
import PlaceIcon from 'material-ui-icons/Place';
import AddIcon from 'material-ui-icons/Add';
import WorkIcon from 'material-ui-icons/Work';
import HomeIcon from 'material-ui-icons/Home';
import LocationIcon from 'material-ui-icons/LocationOn';
import blue from 'material-ui/colors/blue';
import config,  {constant, addressEnum} from './config/default';
import {getCurrentLocation, getGeoLocationFromStreetAddress} from './Location';
import geoString from './GeoLocationString';
import {
  fetchLocation,
  updateFilterLocation,
  fetchAddressBookByUser,
  updateFilterWithCurrentLocation,
  toggleAddressDialog,
} from './actions';
import {connect} from "react-redux";


const styles = theme => ({
  flexGrow: {
    flex: '1 1 auto',
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  white: {
    color: "#FFFFFF",
  },
  chip: {
    fontWeight: 'bold',
    fontSize: '0.8rem',
    margin: theme.spacing.unit,
    background: blue[800],
    color: '#FFFFFF',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
  },  
});


class LocationDrawer extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        open: false,
        locationName: "現在位置",
        isUsingCurrentLocation: true,
      };
      this.geolocation = null;
      this.currentLocationOnClick = this.currentLocationOnClick.bind(this);
      this.addLocationOnClick = this.addLocationOnClick.bind(this);
  }    


  componentWillMount() {
    this.currentLocationOnClick();
  }

  componentWillUpdate(nextProps) {
    if (nextProps.user !== this.props.user) {
      const { geolocation, fetchLocation } = this.props;
      const { user } = nextProps;
      if (user) {
        this.fetchAddress(user.user);
        if (geolocation === null || geolocation.pos === null) {
          fetchLocation();     
        }
      }
    }
  }

  toggleDrawer(open){
    this.setState({open: open});
  };
      
  fetchAddress(user) {
    this.setState({user:user});
    this.props.fetchAddressBookByUser(user);
  }
  
  setLocation(text, coords, isUsingCurrentLocation=false) {
      this.geolocation = coords;
      this.setState({...this.state, isUsingCurrentLocation: isUsingCurrentLocation})
      console.log("set " + text + "(" + this.geolocation.latitude + "," +  this.geolocation.longitude + ")");
      this.setState({locationName: text, geolocation: coords});
      this.toggleDrawer(false);
      const { updateFilterLocation } = this.props;
      updateFilterLocation(coords);
  }

  renderAddressBook() {
    const { classes, addressBook, geolocation } = this.props;
    return addressBook.addresses.map(address => {
      let icons = <PlaceIcon />;
      let type = address.type;
      let text = address.text;
      let locationString = constant.addressNotSet;
      let geolocation = null;
      if (address.geolocation != null) {
        geolocation = {latitude :address.geolocation.latitude,
        longitude: address.geolocation.longitude};
        if (address.streetAddress != null) {
          locationString =  address.streetAddress + " (" + geoString(geolocation.latitude, geolocation.longitude) + ")";
        } else {
          locationString = "近" + geoString(geolocation.latitude, geolocation.longitude);      
        } 
      }
      switch(type) {
        case addressEnum.home:
          icons = <HomeIcon />;
          break;
        case addressEnum.office:
          icons = <WorkIcon />;
          break;
      }
     if (locationString != constant.addressNotSet) {
       return (
         <ListItem button onClick={() => {this.setLocation(text, geolocation)}}>
           <ListItemIcon>
           {icons}
           </ListItemIcon>
           <ListItemText primary={text} secondary={locationString} />
         </ListItem>
       );
     } else {
       return (null);
     }
    });
  }

  addLocationOnClick() {
    this.toggleDrawer(false);
    this.props.toggleAddressDialog(true);
  }

  currentLocationOnClick() {
    this.setState({...this.state, isUsingCurrentLocation: true});
    this.props.updateFilterWithCurrentLocation();
    this.toggleDrawer(false);
  }

  render() {
      const { classes } = this.props;      
      return (
      <div>
          <Chip
            avatar={<LocationIcon className={classes.white}/>}
            onClick={() => {this.toggleDrawer(true)}}
            label={`在${this.state.isUsingCurrentLocation ? constant.currentLocation : this.state.locationName}的${this.props.filter.distance}公里內`}
            className={classes.chip}
          />
          <Drawer anchor="bottom"
              open={this.state.open}
              onClose={() => {this.toggleDrawer(false)}}
              unmountOnExit>
              <div tabIndex={0}
                  role="button"
                  className={classes.fullList}>
                  <List>
                      <ListItem>
                          <Button onClick={this.currentLocationOnClick}>
                              <NearMeIcon />
                              {constant.currentLocation}
                          </Button>
                          <Button onClick={this.addLocationOnClick}>
                              <AddIcon />
                              {constant.addAddressLabel}
                          </Button>
                      </ListItem>
                      <Divider />
                      {this.renderAddressBook()}
                  </List>
              </div>
          </Drawer>
      </div>);
  }
}

LocationDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    filter : state.filter,
    addressBook: state.addressBook,
    geolocation: state.geolocation,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLocation: () => dispatch(fetchLocation()),
    fetchAddressBookByUser:
      user =>
        dispatch(fetchAddressBookByUser(user)),
    updateFilterLocation:
      geolocation =>
        dispatch(updateFilterLocation(geolocation)),
    updateFilterWithCurrentLocation:
      () => dispatch(updateFilterWithCurrentLocation()),
    toggleAddressDialog:
      (flag) => dispatch(toggleAddressDialog(flag)),
  }
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)
(withStyles(styles)(LocationDrawer));
