

import React, { Component } from 'react';
import * as firebase from 'firebase';
import config, {constant} from './config/default';
import Button from 'material-ui/Button';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import InboxIcon from 'material-ui-icons/Inbox';
import Divider from 'material-ui/Divider';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import EventListDialog from './EventListDialog';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import {connect} from "react-redux";
import { togglePublicProfileDialog } from './actions';
import {getUserConcernMessages, getUserPublishMessages, getUserCompleteMessages, getUserProfile} from './UserProfile';

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
    let imageHtml = "等一下";
    let concernMessage = null;
    let publishMessage = null;
    let completeMessage = null;
    if(this.state.userProfile != null) {
      displayName = this.state.userProfile.displayName;
      imageHtml =         <img src={this.state.userProfile.photoURL}/>;
      publishMessage = <EventListDialog title="發表事件: " messageIds={this.publishMessages}/>
      concernMessage = <EventListDialog title="關注事件: " messageIds={this.concernMessages}/>  
      completeMessage = <EventListDialog title="完成事件: " messageIds={this.completeMessages}/> 
      
    }    
    const { classes, open } = this.props;
    return (
      <div>
        <br/>
        <Dialog fullScreen  open={open} onRequestClose={this.handleRequestClose} transition={Transition} unmountOnExit>
          <AppBar className={classes.appBar}>
              <Toolbar>
                      <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                          <CloseIcon />
                      </IconButton>
                      <Typography variant="title" color="inherit" className={classes.flex}>{constant.addressBookLabel}</Typography>           
                  </Toolbar>
              </AppBar>
              <div className={classes.container}>
          <br/>
            <h2>簡介</h2>
            <List disablePadding>
              <ListItem >
                名字: {displayName} <br/>
                {imageHtml}
              </ListItem>
            </List>
            <Divider/>
            <List disablePadding>
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
    id: state.publicProfileDialog.id
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    togglePublicProfileDialog: flag => 
      dispatch(togglePublicProfileDialog(flag)),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PublicProfile));

