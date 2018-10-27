import React, { Component } from 'react';
import LocationDrawer from './LocationDrawer';
import TagDrawer from './TagDrawer';
import SortingDrawer from './SortingDrawer';
import Toolbar from '@material-ui/core/Toolbar';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import {fetchLocation} from "./actions";


const styles = {
  filter: {
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    textAlign: 'center'
  }
};

class FilterBar extends  Component {
  constructor(props) {
    super(props);
    this.isUsePublicAddressBook = false;
    this.disableLocationDrawer = false;
    this.ranking = false;
    if(this.props.ranking === true) {
      this.ranking = true;
    }
    if(this.props.disableLocationDrawer === true) {
      this.disableLocationDrawer = true;
    } else {
      if(this.props.isUsePublicAddressBook === true) {
        this.isUsePublicAddressBook = true;
      }
    }
  }


  componentDidMount() {
  }

  errorCallBack(error) {
    console.warn(`ERROR(${error.code}): ${error.message}`);
  }

  render() {
    const classes = this.props.classes;
    if(this.disableLocationDrawer) {
      return (<Toolbar className={classes.filter}>
         <TagDrawer /> 按 <SortingDrawer/> <div flex={1}/>
      </Toolbar>);
    } else {
      if(this.ranking) {
        return (<Toolbar className={classes.filter}>
                  <LocationDrawer isUsePublicAddressBook={true}/>
              </Toolbar>);
      } else {
        return (<Toolbar className={classes.filter}>
                  <LocationDrawer isUsePublicAddressBook={this.isUsePublicAddressBook}/> 的 <TagDrawer /> 按 <SortingDrawer/> <div flex={1}/>
                </Toolbar>);
      }
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
