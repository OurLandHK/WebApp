import React from 'react';
import * as firebase from 'firebase';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import classnames from 'classnames';
import Chip from '@material-ui/core/Chip';
import List, { ListItem, ListItemIcon, ListItemText } from '@material-ui/core/List';
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
  selectedTag
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
    border: '2px solid' ,
    borderColor: green[200],
//    width: '100%',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    margin: theme.spacing.unit,
    color: '#FFFFFF',
    textAlign: 'left',
    backgroundColor: green[500],
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
    display:'flex',
  },
  buttonContainer: {
    flex: '1 0 auto',
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


class TagDrawer extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        open: false,
        selectedTag: null,
        isSelectedAll: true,
      };
  }    

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.filter.tagList != this.props.filter.tagList) {
      this.setTag(null);
    }
  }

  toggleDrawer(open){
    this.setState({open: open});
  };
        
  setTag(tag) {
    if(tag == null) {
      this.setState({
        selectedTag: null,
        isSelectedAll: true
      });
    } else {
      this.setState({
        selectedTag: tag,
        isSelectedAll: false
      });
    }
    this.toggleDrawer(false);
    const { selectedTag } = this.props;
    selectedTag(tag);
  }

  renderTagList() {
    const { filter } = this.props;
    var tagList=filter.tagList;
    return tagList.map(tag => {
      let icons = <LabelIcon />;
      return (
        <ListItem button onClick={() => {this.setTag(tag)}}>
          <ListItemIcon>
          {icons}
          </ListItemIcon>
          <ListItemText primary={tag} />
        </ListItem>
      );
    });
  }

  renderFirstListItem() {
    return (<ListItem button onClick={() => {this.setTag(null)}}>
              <ListItemIcon>
               <AllIcon />
               </ListItemIcon> 
               <ListItemText primary={constant.noTagLabel} />
            </ListItem>);
  }

  render() {
      let firstItem = this.renderFirstListItem();
      const { classes } = this.props;      
      return (
      <div className={classes.container}>
          <Button
            onClick={() => {this.toggleDrawer(true)}}
            className={classes.button}
          >
            <div className={classes.buttonContainer}>
                {`${this.state.isSelectedAll ? constant.noTagLabel
                          : this.state.selectedTag}`}
            </div>
            <div className={classes.buttonRightContainer}>
              <ArrowIcon className={classes.white}/>
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
                      {firstItem}
                      <Divider />
                      {this.renderTagList()}
                  </List>
              </div>
          </Drawer>
      </div>);
  }
}

TagDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    filter : state.filter
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectedTag:
      tag =>
        dispatch(selectedTag(tag)),
  }
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)
(withStyles(styles)(TagDrawer));
