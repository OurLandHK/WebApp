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
import NearMeIcon from 'material-ui-icons/NearMe';
import AddLocationIcon from 'material-ui-icons/AddLocation';
import PlaceIcon from 'material-ui-icons/Place';
import WorkIcon from 'material-ui-icons/Work';
import HomeIcon from 'material-ui-icons/Home';
import {fetchAddressBaseonUser} from './UserProfile';
import config,  {constant, addressEnum} from './config/default';
import {getCurrentLocation, getGeoLocationFromStreetAddress} from './Location';
import geoString from './GeoLocationString';


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
  chip: {
    margin: theme.spacing.unit,
  },  
});


class LocationDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {open: false,
            addressBook:[],
            geolocation: null,
            locationName: "現在位置"};
        this.disabled = false;
        this.geolocation = null;
        this.successCallBack = this.successCallBack.bind(this);
        this.errorCallBack = this.errorCallBack.bind(this);
        this.notSupportedCallBack = this.notSupportedCallBack.bind(this);
        this.setAddress = this.setAddress.bind(this);
    }    

    
    toggleDrawer(open){
        console.log("open: " + open);
        this.setState({
            open: open,
        });
    };

    handleGetLocation() {
        this.setState({locationName: constant.currentLocation});
        if (this.disabled) {
            alert('Location not supported!');  
        } else {
            getCurrentLocation(this.successCallBack, this.errorCallBack, this.notSupportedCallback);
        }
    }

    componentDidMount() {
        var auth = firebase.auth();
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.fetchAddress(user); 
            } else {
                this.setState({addressBook:[]})
            }
        });
    }    
    
    setAddress(doc) {
        var val = doc.data();
        this.state.addressBook.push(val);
        this.setState({addressBook:this.state.addressBook});
    };
    
      
    fetchAddress(user) {
        this.setState({user:user});
        fetchAddressBaseonUser(user, this.setAddress)
    }
    
    notSupportedCallBack() {
        this.disabled = true;
        this.toggleDrawer(false)  
        console.log('Disabled');
    }

    errorCallBack(err) {
        console.warn('ERROR(${err.code}): ${err.message}');
        this.toggleDrawer(false);
    }

    successCallBack(pos) {
        this.setLocation(pos.coords);
    }
    
    setLocation(coords) {
        this.geolocation = coords;
        console.log("successCallBack " + this.geolocation.latitude + this.geolocation.longitude);
        this.setState({geolocation: coords});
        this.toggleDrawer(false);
    }

    render() {
        const { classes } = this.props;      
        let addressBook = this.state.addressBook.map((address) => {
            let icons = <PlaceIcon />;
            let type = address.type;
            var text = address.text;
            var locationString = constant.addressNotSet;
            var geolocation = null;
            if(address.geolocation != null) {
                geolocation = {latitude :address.geolocation.latitude,
                    longitude: address.geolocation.longitude};
                if(address.streetAddress != null) {
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
            if(locationString != constant.addressNotSet) {
                return (
                        <ListItem button onClick={() => {this.setLocation(geolocation)}}>
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
         
        return (
        <div>
            <Chip onClick={() => {this.toggleDrawer(true)}} label={this.state.locationName} className={classes.chip} />
            <Drawer anchor="bottom"
                open={this.state.open}
                onClose={() => {this.toggleDrawer(false)}}>
                <div tabIndex={0}
                    role="button"
                    className={classes.fullList}>
                    <List>
                        <ListItem button onClick={() => {this.handleGetLocation()}}>
                            <ListItemIcon>
                                <NearMeIcon />
                            </ListItemIcon>
                            <ListItemText primary={constant.currentLocation} />
                        </ListItem>
                        <Divider />
                        {addressBook}
                    </List>
                </div>
            </Drawer>
        </div>);
    }
}

LocationDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LocationDrawer);