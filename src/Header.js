import React, { Component } from 'react';
import SignInButton from './SignInButton';
import DrawerMenu from './Drawer';
import UserProfileView from './UserProfileView'
import UserProfile from './UserProfile';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {connect} from "react-redux";
import {fetchLocation} from "./actions";


const styles = {
  root: {
    marginTop: 1,
    width: '100%',
  },
  flex: {
    flex: 1,
  },
};

const currentLocationLabel = "現在位置";

class Header extends  Component {
  constructor(props) {
    super(props);
    this.state = {locationString: currentLocationLabel};
    this.setLocation = this.setLocation.bind(this);
    this.successCallBack = this.successCallBack.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  handleLeftTouchTap() {
    console.log('Open Drawer');
    alert('onTouchTap triggered on the title component');
    this.drawerMenu.handleToggle();
  }

  componentDidMount() {
  }

  notSupportedCallBack() {
    console.log('Disabled');
  }

  successCallBack(pos) {
    console.log('get New Location: ' + pos.coords.longitude + "," + pos.coords.latitude);
    this.setState({ lat: pos.coords.latitude, lon: pos.coords.longitude}); 
    if(this.props.updateLocationCallback != null) {
      this.props.updateLocationCallback(this.state.locationString, this.state.lon, this.state.lat);
    }
  }

  errorCallBack(error) {
    console.warn('ERROR(${err.code}): ${err.message}');
  }  

  setLocation(locationString, longitude, latitude) {
    console.log("set New Location1:" + locationString);
    if(locationString == "" || locationString == currentLocationLabel) {
      this.setState({locationString: currentLocationLabel});
      //getLocation(this.successCallBack, this.errorCallBack, this.notSupportedCallback);      
    } else {
      console.log("set New Location2:" + longitude + " " + latitude);
      this.setState({locationString: locationString, lon: longitude, lat: latitude});
      if(this.props.updateLocationCallback != null) {
        this.props.updateLocationCallback(this.state.locationString, this.state.lon, this.state.lat);
      }      
    }
  }

  getLocation() {
    var locationValue = {longitude: this.state.lon, latitude: this.state.lat};
    return locationValue;
  }

  render() {
    const classes = this.props.classes;
    return (<div className={classes.root}>
              <AppBar position="fixed">
                <Toolbar>
                  <DrawerMenu header={this} ref={(drawerMenu) => {this.drawerMenu = drawerMenu;}} />
                  <Typography type="title" color="inherit" className={classes.flex}>
                    我地
                  </Typography>
                  <SignInButton/>
                </Toolbar>
              </AppBar>      
            </div>);
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

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



export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Header));
//export default Header;
