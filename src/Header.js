import React, { Component } from 'react';
import SignInButton from './SignInButton';
import DrawerMenu from './Drawer';
import LocationDrawer from './LocationDrawer';
import UserProfileView from './UserProfileView'
import UserProfile from './UserProfile';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import {fetchLocation} from "./actions";
import NotificationsDialog from "./NotificationsDialog";

class Header extends  Component {
  constructor(props) {
    super(props);
  }

  handleLeftTouchTap() {
    console.log('Open Drawer');
    alert('onTouchTap triggered on the title component');
    this.drawerMenu.handleToggle();
  }

  componentDidMount() {
  }

  errorCallBack(error) {
    console.warn('ERROR(${err.code}): ${err.message}');
  }

  render() {
    const classes = this.props.classes;
    return (<AppBar className="header">
              <Toolbar>
                <div className="header-title">
                  我地
                </div>
                <SignInButton/>
                <NotificationsDialog/>
                <DrawerMenu header={this} ref={(drawerMenu) => {this.drawerMenu = drawerMenu;}} />
              </Toolbar>
            </AppBar>);
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


export default connect(mapStateToProps, mapDispatchToProps)(Header);
