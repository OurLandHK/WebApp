import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText  from '@material-ui/core/ListItemText';
import LocationOn from '@material-ui/icons/LocationOn';
import EventListDialog from './EventListDialog';
import ChatBubbleIcon from '@material-ui/icons/ChatBubbleOutline';
import PersonIcon from '@material-ui/icons/Person';
import UserProfileView from './UserProfileView';
import {upgradeAllUser} from './UserProfile';
import AddressDialog from './address/AddressDialog';
import FocusDialog from './admin/FocusDialog';
import {connect} from "react-redux";
import {checkImageExists} from './util/http';
import MissionView from './mission/MissionView';
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
    let missionHtml = null;
    let focusButton = null;
    let userProfileView = <UserProfileView ref={(userProfileView) => {this.userProfileView = userProfileView;}} openDialog={openDialog => this.openUserProfileDialog = openDialog}/>;
    const { user } = this.props;

    if (user && user.user && user.userProfile) {
        let imgURL = user.userProfile.photoURL;
        if(!checkImageExists(imgURL)) {
          imgURL = '/images/profile_placeholder.png';
        }
        userSection = (<div style={{alignItems: "center", display: "flex"}}>&nbsp;&nbsp;&nbsp;<img src={imgURL} alt='' style={{height:"20px", width:"20px"}}/>&nbsp;&nbsp;{user.userProfile.displayName}&nbsp;&nbsp;</div>);
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
        missionHtml = <MissionView user={user.user} userProfile={user.userProfile} addressList={addressBook.addresses} bookmarkList={user.bookmarkList} publicProfileView={true}/>
        if (user.userProfile  != null  & (user.userProfile.role === RoleEnum.admin || user.userProfile.role === RoleEnum.monitor)) {
          focusButton = <FocusDialog/>;
        }
        if(user.userProfile  != null  & user.userProfile.role === RoleEnum.admin) {
            adminButton = <ListItem button>
            <ListItemIcon>
                <ChatBubbleIcon />
            </ListItemIcon>
            <ListItemText primary="Upgrade" onClick={() => this.upgrade()}/>
            </ListItem>
        }
    }


    return (
      <React.Fragment>
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
            {missionHtml}
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
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    addressBook: state.addressBook,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleAddressDialog: flag => dispatch(toggleAddressDialog(flag)),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(Person);
