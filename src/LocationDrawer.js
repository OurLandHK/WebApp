import React from 'react';
import * as firebase from 'firebase';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import classnames from 'classnames';
import Chip from '@material-ui/core/Chip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText  from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import NearMeIcon from '@material-ui/icons/NearMe';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import PlaceIcon from '@material-ui/icons/Place';
import AddIcon from '@material-ui/icons/Add';
import ArrowIcon from '@material-ui/icons/ArrowDropDownCircle';
import WorkIcon from '@material-ui/icons/Work';
import HomeIcon from '@material-ui/icons/Home';
import LocationIcon from '@material-ui/icons/LocationOn';
import green from '@material-ui/core/colors/green';
import config,  {constant, addressEnum} from './config/default';
import {getCurrentLocation, getGeoLocationFromStreetAddress} from './Location';
import geoString from './GeoLocationString';
import {
  fetchLocation,
  updateFilterLocation,
  fetchAddressBookByUser,
  fetchAddressBookFromOurLand,
  updateFilterWithCurrentLocation,
  toggleAddressDialog,
} from './actions';
import {connect} from 'react-redux';


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
    color: '#FFFFFF',
  },
  button: {
//    border: '2px solid' ,
//    borderColor: green[200],
//    width: '100%',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    margin: theme.spacing.unit,
//    color: '#FFFFFF',
    textAlign: 'left',
//    backgroundColor: green[500],
//    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
//    display:'flex',
  },
  buttonContainer: {
//    flex: '1 0 auto',
  },
  buttonRightContainer: {
    flex: '1 0 auto',
    textAlign: 'right',
    fontStyle: 'italic',
    fontSize: '1.0rem',
  },
  container: {
    width: '98vw'
  }
});


class LocationDrawer extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        open: false,
        locationName: '現在位置',
        isUsingCurrentLocation: true,
        distance: this.props.filter.distance,
        locationPrefix: ''
      };
      this.isUsePublicAddressBook = false;
      if(this.props.isUsePublicAddressBook == true) {
        this.isUsePublicAddressBook = true;
      }
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
    if(!this.isUsePublicAddressBook) {
      this.props.fetchAddressBookByUser(user);
    } else {
      this.props.fetchAddressBookFromOurLand();
    }
  }

  setLocation(text, distance, coords, isUsingCurrentLocation=false) {
      this.geolocation = coords;
      this.setState({...this.state, isUsingCurrentLocation: isUsingCurrentLocation})
      console.log('set ' + text + '(' + this.geolocation.latitude + ',' +  this.geolocation.longitude + ') radius' + distance);
      this.setState({locationName: text, distance: distance, geolocation: coords});
      this.toggleDrawer(false);
      const { updateFilterLocation } = this.props;
      updateFilterLocation(coords, distance);
  }

  setLocationPrefix(prefix) {
    this.setState({...this.state, locationPrefix: prefix});
  }

  buildGrouppedAddressList(addressList, prefix) {
    return addressList.reduce((grouppedList, address) => {
      if (address.text.startsWith(prefix)) {
        const childPart = address.text.slice(prefix.length);
        if (childPart.includes('/')) {
          const group = childPart.split('/', 2)[0];
          if (!grouppedList.find(a => a.text == group)) {
            grouppedList.push({
              text: group,
              isGroup: true
            });
          }
        } else {
          grouppedList.push({
            ...address,
            text: address.text.slice(prefix.length)
          });
        }
      }
      return grouppedList;
    }, []);
  }

  renderAddressBook() {
    const { classes, addressBook, geolocation } = this.props;
    var addressList=addressBook.addresses;
    if(this.isUsePublicAddressBook) {
      addressList=addressBook.publicAddresses;
    }
    addressList = this.buildGrouppedAddressList(addressList || [], this.state.locationPrefix);
    return addressList.map(address => {
      let type = address.type;
      if(this.isUsePublicAddressBook && (type == addressEnum.home || type == addressEnum.office)) {
        return null;
      }
      let icons = <PlaceIcon />;
      let text = address.text;
      let locationString = constant.addressNotSet;
      let distance = this.props.filter.defaultDistance;
      let geolocation = null;
      if (address.geolocation != null) {
        geolocation = {latitude :address.geolocation.latitude,
        longitude: address.geolocation.longitude};
        if(address.distance != null && address.distance > distance) {
          distance = address.distance;
        }
        if (address.streetAddress != null) {
          locationString =  address.streetAddress + ' (' + geoString(geolocation.latitude, geolocation.longitude) + ')';
        } else {
          locationString = '近' + geoString(geolocation.latitude, geolocation.longitude);
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
      if (address.isGroup) {
        return (
          <ListItem button onClick={() => {this.setLocationPrefix(text + '/')}}>
            <ListItemIcon>
            {icons}
            </ListItemIcon>
            <ListItemText primary={text}/>
          </ListItem>
        );
      } else if (locationString != constant.addressNotSet ) {
       return (
         <ListItem button onClick={() => {this.setLocation(this.state.locationPrefix + text, distance, geolocation)}}>
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
    this.setState({distance: this.props.filter.defaultDistance});
    this.props.updateFilterWithCurrentLocation();
    this.toggleDrawer(false);
  }

  renderFirstListItem() {
    var addAddress = null;
    if(!this.isUsePublicAddressBook) {
      addAddress = <Button onClick={this.addLocationOnClick}>
                      <AddIcon />
                      {constant.addAddressLabel}
                    </Button>
      return (<ListItem>
              <Button onClick={this.currentLocationOnClick}>
               <NearMeIcon />

              </Button>
              {addAddress}
            </ListItem>);
   } else {
      return (<ListItem button onClick={this.currentLocationOnClick}>
      <ListItemIcon>
      <NearMeIcon />
      </ListItemIcon>
      <ListItemText primary={constant.currentLocation} />
    </ListItem>);
   }
  }

  render() {
      let firstItem = this.renderFirstListItem();
      const { classes } = this.props;
      return (
      <div className={classes.container}>
          <Button
            variant="outlined" color="primary"
            onClick={() => {this.toggleDrawer(true)}}
            className={classes.button}
          >
            <div className={classes.buttonContainer}>
                {`${this.state.isUsingCurrentLocation ? constant.currentLocation
                          : this.state.locationName}${this.state.distance}公里`}
            </div>
          </Button>
          <Drawer anchor='bottom'
              open={this.state.open}
              onClose={() => {this.toggleDrawer(false)}}
              unmountOnExit>
              <div tabIndex={0}
                  role='button'
                  className={classes.fullList}>
                  <List>
                      {firstItem}
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
    fetchAddressBookFromOurLand:
      () => dispatch(fetchAddressBookFromOurLand()),
    updateFilterLocation:
      (geolocation, distance) =>
        dispatch(updateFilterLocation(geolocation, distance)),
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
