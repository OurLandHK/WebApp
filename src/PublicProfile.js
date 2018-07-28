

import React, { Component } from 'react';
import * as firebase from 'firebase';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/Inbox';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import EventListDialog from './EventListDialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText  from '@material-ui/core/ListItemText';
import {connect} from "react-redux";
import { togglePublicProfileDialog } from './actions';
import {fetchBookmarkList, getUserPublishMessages, getUserCompleteMessages, getUserProfile} from './UserProfile';
import ShareDrawer from './ShareDrawer';
import BookmarkList from './bookmark/BookmarkList';
import config, {constant, addressEnum, RoleEnum} from './config/default';

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
  }
};

class PublicProfile extends React.Component {
  constructor(props) {
    super(props);
    if(this.props.fbId) {
      this.fbId = this.props.fbId;
    }
    this.state = {userProfile: null, bookmarkList: []};
    this.publishMessages = null;
    this.completeMessages = null;
    this.onBackButtonEvent = this.onBackButtonEvent.bind(this);
  } 

  onBackButtonEvent(e) {
    e.preventDefault();
    this.handleRequestClose();
  }

  componentDidMount() {
    if (this.props.id != "") {
      //console.log("componentDidMount id  " + this.props.id);
      let user = {uid: this.props.id};
      this.fetchUserProfile(user);
    }
    if (this.props.userid != null) {
      //console.log("componentDidMount id  " + this.props.id);
      let user = {uid: this.props.userid};
      this.fetchUserProfile(user);
    }    
  }

  fetchUserProfile(user) {
    this.setState({userProfile: null});
    this.publishMessages = null;
    this.completeMessages = null;
    getUserProfile(user).then((userProfile)=>{
      fetchBookmarkList(user).then((bookmarkList)=>{
      this.completeMessages = userProfile.completeMessages;
      this.publishMessages = userProfile.publishMessages;
      this.setState({user: user, userProfile: userProfile, bookmarkList: bookmarkList});
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.id != this.props.id && this.props.id != "") {
      var user = {uid: this.props.id};
      this.fetchUserProfile(user);
    }
  }


  handleRequestClose = () => {
//    window.onpopstate = this.lastOnPopState;
    if(this.props.closeDialog != null) {
      this.props.closeDialog();
    } else {
      this.props.togglePublicProfileDialog(false);
    }
  };

  
  render() {
    var displayName = "...";
    let imageHtml = "等一下";
//    let concernMessage = null;
    let publishMessage = null;
    let completeMessage = null;
    let desc = null;
    let facebookhtml = null;
    if(this.state.userProfile != null) {
      displayName = this.state.userProfile.displayName;
      var displayNameLabel = "名字:" + displayName;
      imageHtml =  <img src={this.state.userProfile.photoURL}/>;
      if(this.state.userProfile.desc != null && this.state.userProfile.desc != "") {
        desc = <ListItem >
          <ListItemText primary={"簡介: " + this.state.userProfile.desc}/> 
        </ListItem> 
      }
      publishMessage = <EventListDialog title="發表事件: " displayName={displayName} messageIds={this.publishMessages}/>
      completeMessage = <EventListDialog title="完成事件: " displayName={displayName} messageIds={this.completeMessages}/> 
      if(this.state.userProfile.fbuid) {
        this.fbId=this.state.userProfile.fbuid;
      }
    }    



    if(this.fbId && false){
     facebookhtml = 
     <ListItem button >
      <ListItemText primary="臉書連結:"/> <a href={"https://www.facebook.com/" + this.fbId} target="_blank">前往</a>
    </ListItem>;
    }

    
    const { classes, open, id } = this.props;
    let dialogOpen = open;
    let userid = id;
    if(this.props.userid != null) {
      dialogOpen = true;
      userid = this.props.userid;
    }
  /*  can't handle back for publie profile proper yet
    if(open) {
      if(window.onpopstate != this.onBackButtonEvent) {
        this.lastOnPopState = window.onpopstate;
        window.onpopstate = this.onBackButtonEvent;
      }
    }
  */  
    return (
      <div>
        <br/>
        <Dialog fullScreen  open={dialogOpen} onRequestClose={this.handleRequestClose} transition={Transition} unmountOnExit>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                  <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>{constant.publicProfileLabel}</Typography>           
              <ShareDrawer uid={userid} displayName={displayName}/>  
            </Toolbar>
          </AppBar>
          <div className={classes.container}>
            <br/>
            <br/>
            <List>
              <ListItem >
                <ListItemText primary={displayNameLabel}/> <br/> {imageHtml} 
              </ListItem> 
              {desc}  
              {facebookhtml}
              <Divider/>            
              {publishMessage}
              {completeMessage}                                                          
            </List> 
            {constant.bookmarkTitleLabel}
            <BookmarkList bookmarkList={this.state.bookmarkList} /> 
          </div>
        </Dialog>
      </div>);
  }
}

PublicProfile.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    open: state.publicProfileDialog.open,
    id: state.publicProfileDialog.id,
    fbId: state.publicProfileDialog.fbId
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    togglePublicProfileDialog: flag => 
      dispatch(togglePublicProfileDialog(flag)),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PublicProfile));

