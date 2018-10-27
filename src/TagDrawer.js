import React from 'react';
//import * as firebase from 'firebase';
import PropTypes from 'prop-types';
//import classnames from 'classnames';
import {connect} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText  from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import LabelIcon from '@material-ui/icons/LabelOutlined';
import AllIcon from '@material-ui/icons/AllInclusive';
import  {constant, addressEnum} from './config/default';
import {
  selectedTag
} from './actions';


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


class TagDrawer extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        open: false,
        selectedTag: null,
        isSelectedAll: true,
        isRenderTagList: true,
        tagList: []
      };
  }

  componentDidMount() {
    let {isRenderTagList} = this.props;

    if(isRenderTagList  != null ) {
      this.setState({
        isRenderTagList
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.filter.tagList !== this.props.filter.tagList) {
      this.setTag(null);
      this.setState({tagList: this.props.filter.tagList})
    }
  }

  toggleDrawer(open){
    this.setState({open: open});
  };

  setTag(tag) {
    if(tag === null) {
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
    let tagList=this.state.tagList;
    return tagList.map(tag => {
      let icons = <LabelIcon />;
      return (
        <ListItem button key={tag} onClick={() => {this.setTag(tag)}}>
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
      let {isRenderTagList} = this.state;

      const { classes } = this.props;

      return (
      <div>
          <Button
          variant="outlined" color="primary"
            onClick={() => {this.toggleDrawer(true)}}
            className={classes.signButton}
          >
            <div className={classes.buttonContainer}>
                {`${this.state.isSelectedAll ? constant.noTagLabel
                          : this.state.selectedTag}`}
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
                      {isRenderTagList && this.renderTagList()}
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


export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(TagDrawer));
