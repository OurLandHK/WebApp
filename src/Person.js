import React, { Component } from 'react';
import * as firebase from 'firebase';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/Inbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText  from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import StarIcon from '@material-ui/icons/Star';
import LocationOn from '@material-ui/icons/LocationOn';
import EventListDialog from './EventListDialog';
import ChatBubbleIcon from '@material-ui/icons/ChatBubbleOutline';
import PersonIcon from '@material-ui/icons/Person';
import UserProfileView from './UserProfileView';
import {upgradeAllUser} from './UserProfile';
import AddressDialog from './address/AddressDialog';
import FocusDialog from './admin/FocusDialog';
import {connect} from "react-redux";
import {fileExists} from './util/http';
import Divider from '@material-ui/core/Divider';
import {
  toggleAddressDialog,
} from "./actions";
import {upgradeAllMessage} from './MessageDB';
import { constant, RoleEnum } from './config/default';
import AboutDialog from './AboutDialog';
import SignOutButton from './SignOutButton';




class Person extends Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  userProfileClick(){
    this.openUserProfileDialog();
  }

  addressDialogClick(){
    this.props.toggleAddressDialog(true);
  }


  showAbout() {
    this.openAboutDialog();
  }

  upgrade() {
    upgradeAllMessage();
    upgradeAllUser(

    );
  }


  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState) {
  }


  render() {
    let userSection = (<div></div>);
    let signOutSection = null;
    let userLoginDisplay =  null;
    let adminButton = null;
    let publishMessage = null;
    let completeMessage = null;
    let focusButton = null;
    let userProfileView = userProfileView = <UserProfileView ref={(userProfileView) => {this.userProfileView = userProfileView;}} openDialog={openDialog => this.openUserProfileDialog = openDialog}/>;
    const { user } = this.props;

    if (user && user.user && user.userProfile) {
        let imgURL = user.userProfile.photoURL;
        if(!fileExists(imgURL)) {
          imgURL = '/images/profile_placeholder.png';
        }
        userSection = (<div style={{alignItems: "center", display: "flex"}}>&nbsp;&nbsp;&nbsp;<img src={imgURL} style={{height:"20px", width:"20px"}}/>&nbsp;&nbsp;{user.userProfile.displayName}&nbsp;&nbsp;</div>);
        signOutSection = (<ListItem><SignOutButton/></ListItem>);
        userLoginDisplay = (<span>
                            <ListItem button>
                                <ListItemIcon>
                                <PersonIcon />
                                </ListItemIcon>
                                <ListItemText primary="使用者設定" onClick={() => this.userProfileClick()}/>
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                <LocationOn />
                                </ListItemIcon>
                                <ListItemText primary={constant.addressBookLabel} onClick={() => this.addressDialogClick()}/>
                            </ListItem></span>);
        publishMessage = <EventListDialog title="發表事件: " messageIds={user.userProfile.publishMessages}/>
        completeMessage = <EventListDialog title="完成事件: " messageIds={user.userProfile.completeMessages}/>          
        if (user.userProfile != null & (user.userProfile.role == RoleEnum.admin || user.userProfile.role == RoleEnum.monitor)) {
          focusButton = <FocusDialog/>;
        }   
        if(user.userProfile != null & user.userProfile.role == RoleEnum.admin) {
            adminButton = <ListItem button>
            <ListItemIcon>
                <ChatBubbleIcon />
            </ListItemIcon>
            <ListItemText primary="Upgrade" onClick={() => this.upgrade()}/>
            </ListItem>
        }
    }


    return (
      <div>
        {userProfileView}
        <AddressDialog ref={(addressDialog) => {this.addressDialog = addressDialog;}} openDialog={openDialog => this.openAddressDialog = openDialog}/>
        <AboutDialog openDialog={f => this.openAboutDialog = f}/>
        <List>
            <ListItem>
            {userSection}
            </ListItem>
            {signOutSection}
        </List>
        <Divider/>
        <List disablePadding>
            {userLoginDisplay}
            {publishMessage}
            {completeMessage}  
            <ListItem button>
            <ListItemIcon>
                <ChatBubbleIcon />
            </ListItemIcon>
            <ListItemText primary="關於" onClick={() => this.showAbout()}/>
            </ListItem>
            <Divider/>
            {focusButton}
            {adminButton}
        </List>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleAddressDialog: flag => dispatch(toggleAddressDialog(flag)),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(Person);
