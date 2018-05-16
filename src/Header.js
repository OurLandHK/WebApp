import React, { Component } from 'react';
import SignInButton from './SignInButton';
import DrawerMenu from './Drawer';
import LocationDrawer from './LocationDrawer';
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
    return (<div className={classes.root}>
              <AppBar position="fixed">
                <Toolbar>
                  <SignInButton/>
                  <Typography variant="title" color="inherit" className={classes.flex}>
                    我地
                  </Typography>
                  <DrawerMenu header={this} ref={(drawerMenu) => {this.drawerMenu = drawerMenu;}} />
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
