import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
//import IconButton from '@material-ui/core/IconButton';
//import classnames from 'classnames';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText  from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import NearMeIcon from '@material-ui/icons/NearMe';
import FolderIcon from '@material-ui/icons/Folder';
import PlaceIcon from '@material-ui/icons/Place';
import AddIcon from '@material-ui/icons/Add';
import WorkIcon from '@material-ui/icons/Work';
import HomeIcon from '@material-ui/icons/Home';
import {connect} from 'react-redux';
import {constant, addressEnum} from './config/default';
//import {getCurrentLocation, getGeoLocationFromStreetAddress} from './Location';
import geoString from './GeoLocationString';
import {
  fetchLocation,
  updateFilterLocation,
  fetchAddressBookByUser,
  fetchAddressBookFromOurLand,
  updateFilterWithCurrentLocation,
  toggleAddressDialog,
} from './actions';
import {trackEvent} from './track';


const styles = theme => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  white: {
    color: '#FFFFFF',
  },
  /*

button: {
    fontWeight: 'bold',
    fontSize: '0.8rem',
    margin: theme.spacing.unit,
    textAlign: 'left',
    padding: 0,
    border: 0,
    borderBottom: '1px solid',
    borderRadius: 0,
    minHeight: 'auto'
  },
*/

signButton: {
  fontWeight: 'bold',
  display: 'inline-block',
  margin: theme.spacing.unit,
  textAlign: 'center',
  color: 'white',
  backgroundColor: '#006eb9',
  padding: '5px',
  '&:hover': {
    backgroundColor: '#006eb9',
  }
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
      if(this.props.isUsePublicAddressBook === true) {
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
      if (user && user.user) {
        this.fetchAddress(user.user);
        if (geolocation === null || geolocation === undefined|| geolocation.pos === null) {
          fetchLocation();
        }
      }
    }
  }

  toggleDrawer(open){
    this.setState({open: open, locationPrefix: ''});
  };

  fetchAddress(user) {
    this.setState({user:user});
    this.props.fetchAddressBookByUser(user);
    if(this.isUsePublicAddressBook) {
      this.props.fetchAddressBookFromOurLand();
    }
  }

  setLocation(text, distance, coords, isUsingCurrentLocation=false) {
      this.geolocation = coords;
      this.setState({...this.state, isUsingCurrentLocation: isUsingCurrentLocation})
      console.log('set ' + text + '(' + this.geolocation.latitude + ',' +  this.geolocation.longitude + ') radius' + distance);
      trackEvent('Filter', text);
      this.setState({locationName: text, distance: distance, geolocation: coords});
      this.toggleDrawer(false);
      const { updateFilterLocation } = this.props;

      updateFilterLocation(coords, distance, this.props.filterID);
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
          if (!grouppedList.find(a => a.text === group)) {
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
      } else {
        //console.log(address.text + "\  " + prefix);
      }
      return grouppedList;
    }, []);
  }

  renderAddressBook() {
    const { addressBook, user } = this.props;
    let addressList=[];
    if(this.isUsePublicAddressBook) {
      let address = null;
      if(user.userProfile) {
        for(address of addressBook.addresses) {
          addressList.push(address);
        };
      }
      for(address of addressBook.publicAddresses) {
        if(address.type !== addressEnum.home && address.type !== addressEnum.office) {
            let newAddress = Object.create(address);
            newAddress.text = `${constant.regionEventLabel}/${address.text}`;
            newAddress.geolocation = address.geolocation;
            //console.log(newAddress.text);
            addressList.push(newAddress)
        }
      };
    }
    //console.log(this.state.locationPrefix);
    addressList = this.buildGrouppedAddressList(addressList || [], this.state.locationPrefix);
    return addressList.map(address => {
      let type = address.type;
      let icons = null;
      let text = address.text;
      let locationString = constant.addressNotSet;
      let distance = this.props.filter.defaultDistance;
      let geolocation = null;
      if (address.geolocation  != null ) {
        geolocation = {latitude :address.geolocation.latitude,
        longitude: address.geolocation.longitude};
        if(address.distance  != null  && address.distance > distance) {
          distance = address.distance;
        }
        if (address.streetAddress  != null ) {
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
        default:
          icons = <PlaceIcon />;
      }
      if (address.isGroup) {
        //console.log(text);
        icons = <FolderIcon />
        return (
          <ListItem key={text} button onClick={() => {this.setLocationPrefix(this.state.locationPrefix + text + '/')}}>
            <ListItemIcon>
            {icons}
            </ListItemIcon>
            <ListItemText primary={text}/>
          </ListItem>
        );
      } else if (locationString !== constant.addressNotSet ) {
       text = `${text} ${constant.nearby} ${distance}${constant.kilometre}`;
       return (
         <ListItem key={text} button onClick={() => {this.setLocation(this.state.locationPrefix + text, distance, geolocation)}}>
           <ListItemIcon>
           {icons}
           </ListItemIcon>
           <ListItemText primary={text} secondary={locationString} />
         </ListItem>
       );
     } else {
//       console.log(text + " " +  address.geolocation + " " + locationString)
       return null;
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
    this.props.updateFilterWithCurrentLocation(this.props.filterID);
    this.toggleDrawer(false);
  }

  renderFirstListItem() {
    var addAddress = null;
    if(this.props.user.userProfile  != null ) {
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
      <div>
          <Button
            variant="outlined" color="primary"
            onClick={() => {this.toggleDrawer(true)}}
            className={classes.signButton}
          >
            <div className={classes.buttonContainer}>
                {`${this.state.isUsingCurrentLocation ? constant.currentLocation + this.state.distance + '公里'
                          : this.state.locationName}`}
            </div>
          </Button>
          <Drawer anchor='bottom'
              open={this.state.open}
              onClose={() => {this.toggleDrawer(false)}} >
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
    user: state.user,
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
      (geolocation, distance, filterID) =>
        dispatch(updateFilterLocation(geolocation, distance, filterID)),
    updateFilterWithCurrentLocation:
      (filterID) => dispatch(updateFilterWithCurrentLocation(filterID)),
    toggleAddressDialog:
      (flag) => dispatch(toggleAddressDialog(flag)),
  }
};


export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(LocationDrawer));
