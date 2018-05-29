import React, { Component } from 'react';
import SignInButton from './SignInButton';
import DrawerMenu from './Drawer';
import LocationDrawer from './LocationDrawer';
import TagDrawer from './TagDrawer';
import SortingDrawer from './SortingDrawer';
import UserProfileView from './UserProfileView'
import UserProfile from './UserProfile';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import {fetchLocation} from "./actions";


const styles = {
  filter: {
    //width: '100%',
    borderColor: 'primary',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    textAlign: 'left',
    //    width: '100%',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
  },
  flex: {
    flex: 1,
  },
};

class FilterBar extends  Component {
  constructor(props) {
    super(props);
    this.isUsePublicAddressBook = false;
    this.disableLocationDrawer = false;
    if(this.props.disableLocationDrawer == true) {
      this.disableLocationDrawer = true;
    } else {
      if(this.props.isUsePublicAddressBook == true) {
        this.isUsePublicAddressBook = true;
      }
    }
  }


  componentDidMount() {
  }

  errorCallBack(error) {
    console.warn('ERROR(${err.code}): ${err.message}');
  }  

  render() {
    const classes = this.props.classes;
    if(this.disableLocationDrawer) {
      return (<Toolbar className={classes.filter}>
         <TagDrawer /> 按 <SortingDrawer/> <div flex={1}/>
      </Toolbar>);
    } else {
      return (<Toolbar className={classes.filter}>
                  <LocationDrawer isUsePublicAddressBook={this.isUsePublicAddressBook}/> 的 <TagDrawer /> 按 <SortingDrawer/> <div flex={1}/>
                </Toolbar>);
    }
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
