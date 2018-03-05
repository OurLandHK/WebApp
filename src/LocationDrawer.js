import React from 'react';
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
import config, {constant} from './config/default';
import {getCurrentLocation, getGeoLocationFromStreetAddress} from './Location';
import {
  isConcernMessage, 
  toggleConcernMessage
} from './UserProfile';

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
            geolocation: null,
            addressBook: null,
            locationName: "現在位置"};
        this.disabled = false;
        this.geolocation = null;
        this.successCallBack = this.successCallBack.bind(this);
        this.errorCallBack = this.errorCallBack.bind(this);
        this.notSupportedCallBack = this.notSupportedCallBack.bind(this);        
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
        this.geolocation = pos.coords;
        console.log("successCallBack " + this.geolocation.latitude + this.geolocation.longitude);
        this.setState({geolocation: pos.coords});
        this.toggleDrawer(false);
    }

    render() {
        const { classes } = this.props;
        let addressBook = null;
    /*    
        let addressBook = this.state.addressBook.reverse().map((location) => {
            return (
                    <ListItem button>
                        <ListItemIcon>
                            <PlaceIcon />
                        </ListItemIcon>
                        <ListItemText primary="Office" secondary="近 22.4N, 114,E" />
                    </ListItem>
        });
    */     
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
                        {addressBook}
                    </List>
                    <Divider />
                    <List> 
                        <ListItem button onClick={() => {this.toggleDrawer(false)}}>
                            <ListItemIcon>
                                <AddLocationIcon />
                            </ListItemIcon>
                            <ListItemText primary="Add a new address" />
                        </ListItem>
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