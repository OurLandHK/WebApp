

import React, { Component } from 'react';
import * as firebase from 'firebase';
import config, {constant} from './config/default';
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
import {getUserConcernMessages, getUserPublishMessages, getUserCompleteMessages, getUserProfile} from './UserProfile';
import ShareDrawer from './ShareDrawer';

function Transition(props) {
  return <Slide direction="right" {...props} />;
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
    this.state = {userProfile: null};
    this.concernMessages = null;
    this.publishMessages = null;
    this.completeMessages = null;
  } 

  componentDidMount() {
    if (this.props.id != "") {
      //console.log("componentDidMount id  " + this.props.id);
      var user = {uid: this.props.id};
      this.fetchUserProfile(user);
    }
  }

  fetchUserProfile(user) {
    this.setState({userProfile: null});
    this.concernMessages = null;
    this.publishMessages = null;
    this.completeMessages = null;
    getUserProfile(user).then((userProfile)=>{
      getUserConcernMessages(user).then((concernMessages)=>{
        getUserPublishMessages(user).then((publishMessages)=>{
          getUserCompleteMessages(user).then((completeMessages)=>{
            this.completeMessages = completeMessages;
            this.concernMessages = concernMessages;
            this.publishMessages = publishMessages;
            this.setState({user: user, userProfile: userProfile});
          });
        });            
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
//    console.log(prevProps.id + " id  " + this.props.id);
//    console.log(prevProps.open + " open " + this.props.open);
    if (prevProps.id != this.props.id && this.props.id != "") {
      var user = {uid: this.props.id};
      this.fetchUserProfile(user);
    }
  }


  handleRequestClose = () => {
    this.props.togglePublicProfileDialog(false);
  };

  
  render() {
    var displayName = "...";
    var facebookLink = "...";
    let imageHtml = "等一下";
    let concernMessage = null;
    let publishMessage = null;
    let completeMessage = null;
    let desc = null;
    let facebookhtml = "暫無";
    if(this.state.userProfile != null) {
      displayName = this.state.userProfile.displayName;
      var displayNameLabel = "名字:" + displayName;
      imageHtml =         <img src={this.state.userProfile.photoURL}/>;
      if(this.state.userProfile.desc != null && this.state.userProfile.desc != "") {
        desc = <ListItem >
          <ListItemText primary={"簡介: " + this.state.userProfile.desc}/> 
        </ListItem> 
      }
      publishMessage = <EventListDialog title="發表事件: " messageIds={this.publishMessages}/>
      concernMessage = <EventListDialog title="關注事件: " messageIds={this.concernMessages}/>  
      completeMessage = <EventListDialog title="完成事件: " messageIds={this.completeMessages}/> 
      if(this.state.userProfile.fbuid) {
        this.fbId=this.state.userProfile.fbuid;
      }
    }    



    if(this.fbId){
     facebookhtml = <a href={"https://www.facebook.com/" + this.fbId} target="_blank">前往</a>;
    }

    
    const { classes, open, id } = this.props;
    return (
      <div>
        <br/>
        <Dialog fullScreen  open={open} onRequestClose={this.handleRequestClose} transition={Transition} unmountOnExit>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                  <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>{constant.publicProfileLabel}</Typography>           
              <ShareDrawer uid={id} displayName={displayName}/>  
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
            <ListItem button >
              <ListItemText primary="臉書連結:"/> {facebookhtml}
            </ListItem>        
            <Divider/>            
            {publishMessage}
            {concernMessage}
            {completeMessage}                                                         
            </List> 
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

