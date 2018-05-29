import React from 'react';
import * as firebase from 'firebase';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import classnames from 'classnames';
import Chip from '@material-ui/core/Chip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText  from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import LabelIcon from '@material-ui/icons/LabelOutline';
import AllIcon from '@material-ui/icons/AllInclusive';
import ArrowIcon from '@material-ui/icons/ArrowDropDownCircle';
import green from '@material-ui/core/colors/green';
import config,  {constant, addressEnum} from './config/default';
import {getCurrentLocation, getGeoLocationFromStreetAddress} from './Location';
import geoString from './GeoLocationString';

import {
  selectedSorting
} from './actions';
import {connect} from 'react-redux';


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
  white: {
    color: '#FFFFFF',
  },
  button: {
    //    border: '2px solid' ,
    //    borderColor: green[200],
    //    width: '100%',
        fontWeight: 'bold',
        fontSize: '0.8rem',
        margin: theme.spacing.unit,
    //    color: '#FFFFFF',
        textAlign: 'left',
    //    backgroundColor: green[500],
    //    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
    //    display:'flex',
      },
  buttonContainer: {
  //  flex: '1 0 auto',
  },
  buttonRightContainer: {
    flex: '1 0 auto',
    textAlign: 'right',
    fontStyle: 'italic',
    fontSize: '1.0rem',
  },
  container: {
    width: '98vw'
  } 
});


class SortingDrawer extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        open: false,
        selectedSorting: null,
        isSortByDefault: true,
        isSortByLastUpdate: false,
        isSortByDistance: false
      };
  }    

  toggleDrawer(open){
    this.setState({open: open});
  };

  setSorting(sorting){
  	 if(sorting == null) {
      this.setState({
        selectedSorting: null,
        isSortByDefault: true,
        isSortByLastUpdate: false,
        isSortByDistance: false
      });
    } else if(sorting == 'sortByLastUpdate'){
      this.setState({
        selectedSorting: sorting,
        isSortByLastUpdate: true,
        isSortByDefault: false,
        isSortByDistance: false
      });
    } else if(sorting == 'sortByDistance'){
      this.setState({
        selectedSorting: sorting,
        isSortByDistance: true,
        isSortByLastUpdate: false,
        isSortByDefault: false
      });
    }

    this.toggleDrawer(false);
    const { selectedSorting } = this.props;
    selectedSorting(sorting);
  }

  renderSortByDefault(){
    return (<ListItem button onClick={() => {this.setSorting(null)}}>
               <ListItemText primary={constant.sortByDefaultLabel} />
            </ListItem>);
  }

  renderSortByLastUpdate() {
    return (<ListItem button onClick={() => {this.setSorting('sortByLastUpdate')}}>
               <ListItemText primary={constant.sortByLastUpdateLabel} />
            </ListItem>);
  }

  renderSortByDistance(){
  	return (<ListItem button onClick={() => {this.setSorting('sortByDistance')}}>
               <ListItemText primary={constant.sortByDistanceLabel} />
            </ListItem>);
  }

  renderSortBtnLabel(){
    let label = constant.sortByDefaultLabel;

    if(this.state.isSortByLastUpdate){
      label = constant.sortByLastUpdateLabel;
    }

    if(this.state.isSortByDistance){
      label = constant.sortByDistanceLabel;
    }

    return label;
  }

  render() {
      let sortByDefault = this.renderSortByDefault();
  	  let sortByLastUpdate = this.renderSortByLastUpdate();
  	  let sortByDistance = this.renderSortByDistance();
      let sortBtnLabel = this.renderSortBtnLabel();
      const { classes } = this.props;      
      return (
      <div className={classes.container}>
          <Button
            variant="outlined" color="primary" 
            onClick={() => {this.toggleDrawer(true)}}
            className={classes.button}
          >
            <div className={classes.buttonContainer}>
                {sortBtnLabel}
            </div>
          </Button>
          <Drawer anchor='bottom'
              open={this.state.open}
              onClose={() => {this.toggleDrawer(false)}}
              unmountOnExit>
              <div tabIndex={0}
                  role='button'
                  className={classes.fullList}>
                  <List>
                    {sortByDefault}
                    <Divider />
                  	{sortByLastUpdate}
                  	<Divider />
                  	{sortByDistance}
                  </List>
              </div>
          </Drawer>
      </div>);
  }
}

SortingDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    filter : state.filter
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
  	selectedSorting:
      sorting =>
        dispatch(selectedSorting(sorting)),
  }
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)
(withStyles(styles)(SortingDrawer));
