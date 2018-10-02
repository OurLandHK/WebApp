
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tab  from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Slide from '@material-ui/core/Slide';
import {connect} from "react-redux";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CloseIcon from '@material-ui/icons/Close';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';

import {constant} from '../config/default';
import BookmarkList from './BookmarkList';
import BookmarkView from './BookmarkView';
import {
  checkAuthState,
} from '../actions';

function Transition(props) {
  return <Slide direction="left" {...props} />;
}

const styles = {
    appBar: {
      position: 'relative',
    },
    flex: {
      flex: 1,
    },
    container: {
       overflowY: 'auto'
    },
    media: {
      color: '#fff',
      position: 'relative',
      height: '10rem',
    },
    mediaCredit: {
      position:'absolute',
      bottom:'0',
      right:'0',
      fontSize:'0.5rem',
    }
  };

function Transition(props) {
  return <Slide direction="left" {...props} />;
}

class BookmarkBoard extends React.Component {
  constructor(props) {
//    console.log("createEventListDialog");
    super(props);
    this.state = {
      tabValue: constant.myBookmarkLabel,
      open: false,
    };
  }
  handleChange = (event, value) => {
    this.setState({ tabValue: value });
  }

  handleRequestOpen = () => {
    this.setState({open: true});
  }

  handleRequestClose = () => {
    this.setState({open: false});
  }


  renderMessages() {
    const { classes, user } = this.props;
    console.log(user)

    return (
      <div className={classes.container}>
        <BookmarkList bookmarkList={user.bookmarkList}/>
      </div>
    );
  }

  renderBookmarkBoard() {

    const { classes, user} = this.props;
    const { tabValue } = this.state;
    return (
      <div class="bookmakrboard-wrapper">
        <div class="tabs-row">
          <Tabs
            value={tabValue}
            onChange={this.handleChange}
            fullWidth
          >
            <Tab label={constant.myBookmarkLabel} value={constant.myBookmarkLabel}/>
            <Tab label={constant.publicBookmarkLabel} value={constant.publicBookmarkLabel}/>
            <BookmarkView/>
          </Tabs>
        </div>
        {tabValue === constant.myBookmarkLabel && this.renderMessages()}
      </div>
    );
  }


  render() {
    const { classes, user} = this.props;
    console.log("this.state.open=" + this.state.open)
    return (
      <React.Fragment>
        <div onClick={this.handleRequestOpen}>
          <ListItem button>
            <ListItemIcon>
            <FavoriteIcon />
            </ListItemIcon>
            <ListItemText primary={constant.myBookmarkLabel} onClick={() => this.handleRequestOpen()}/>
          </ListItem>
        </div>
        <Dialog fullScreen open={this.state.open} onRequestClose={this.handleRequestClose} transition={Transition} unmountOnExit>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                  <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>{constant.myBookmarkLabel}</Typography>
            </Toolbar>
          </AppBar>
          <div className={classes.container}>
            {this.renderBookmarkBoard()}
          </div>
        </Dialog>
      </React.Fragment>
    );
  }
}

BookmarkBoard.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
   
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BookmarkBoard));
