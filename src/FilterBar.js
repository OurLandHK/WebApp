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
  filter: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
};


class FilterBar extends  Component {
  constructor(props) {
    super(props);
  }


  componentDidMount() {
  }

  errorCallBack(error) {
    console.warn('ERROR(${err.code}): ${err.message}');
  }  

  render() {
    const classes = this.props.classes;
    return (<Toolbar>
                  <LocationDrawer />
                </Toolbar>);
  }
}

FilterBar.propTypes = {
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


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FilterBar));
