import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
//import classnames from 'classnames';
//import Chip from '@material-ui/core/Chip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText  from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import {constant} from './config/default';
//import {getCurrentLocation, getGeoLocationFromStreetAddress} from './Location';
//import geoString from './GeoLocationString';

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
    fontWeight: 'bold',
    fontSize: '0.8rem',
    margin: theme.spacing.unit,
    textAlign: 'left',
    padding: 0,
    border: 0,
    borderBottom: '1px solid',
    borderRadius: 0,
    minHeight: 'auto'
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
  signButton: {
    fontWeight: 'bold',
    display: 'inline-block',
    margin: theme.spacing.unit,
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#006eb9',
    padding: '5px',
    '&:hover': {
      backgroundColor: '#006eb9',
    }
  },
});


class SortingDrawer extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        open: false,
        selectedSorting: null,
        isSortByLastUpdate: true,
        isSortByDistance: false
      };
  }

  toggleDrawer(open){
    this.setState({open: open});
  };

  setSorting(sorting){
  	 if(sorting === 'sortByLastUpdate'){
      this.setState({
        selectedSorting: sorting,
        isSortByLastUpdate: true,
        isSortByDistance: false
      });
    } else if(sorting === 'sortByDistance'){
      this.setState({
        selectedSorting: sorting,
        isSortByDistance: true,
        isSortByLastUpdate: false
      });
    }

    this.toggleDrawer(false);
    const { selectedSorting } = this.props;
    selectedSorting(sorting);
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
  	  let sortByLastUpdate = this.renderSortByLastUpdate();
  	  let sortByDistance = this.renderSortByDistance();
      let sortBtnLabel = this.renderSortBtnLabel();
      const { classes } = this.props;
      return (
      <div>
          <Button
            variant="outlined" color="primary"
            onClick={() => {this.toggleDrawer(true)}}
            className={classes.signButton}
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


export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(SortingDrawer));
