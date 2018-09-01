import React, { Component } from 'react';
import SignInButton from './SignInButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import {fetchLocation} from "./actions";
import NotificationsDialog from "./NotificationsDialog";

class Header extends Component {
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
              </Toolbar>
            </AppBar>);
  }
}

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
