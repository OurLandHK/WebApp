import React, { Component } from 'react';
import * as firebase from 'firebase';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/Inbox';
import List, { ListItem, ListItemIcon, ListItemText } from '@material-ui/core/List';
import Icon from '@material-ui/core/Icon';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import StarIcon from '@material-ui/icons/Star';
import LocationOn from '@material-ui/icons/LocationOn';
import ChatBubbleIcon from '@material-ui/icons/ChatBubbleOutline';
import PersonIcon from '@material-ui/icons/Person';
import UserProfileView from './UserProfileView';
import AddressDialog from './address/AddressDialog';
import EventListDialog from './EventListDialog';
import LeaderBoard from './LeaderBoard';
import {connect} from "react-redux";
import Divider from '@material-ui/core/Divider';
import {
  fetchLocation,
  toggleAddressDialog,
  toggleLeaderBoard,
} from "./actions";
import { constant } from './config/default';
import AboutDialog from './AboutDialog';
import SignOutButton from './SignOutButton';

const currentLocationLabel = "現在位置";
const officeLocationLabel = "辦公室位置";
const homeLocationLabel = "屋企位置";


class DrawerMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle(){
    this.setState({open: !this.state.open});
  }

  handleClose(){
    this.setState({open: false});
  }

  userProfileClick(){
    this.handleClose();
    this.openUserProfileDialog();
  }

  addressDialogClick(){
    this.handleClose();
    this.props.toggleAddressDialog(true);
  }

  leaderBoardClick(){
    this.handleClose();
    this.props.toggleLeaderBoard(true);
  }


  showAbout() {
    this.handleClose();
    this.openAboutDialog();
  }


  currentClick() {
    this.props.fetchLocation();
    this.handleClose();
  }  

  componentDidMount() {
    if(this.props.user && this.props.user.userProfile) {
      this.setState({concernMessages: this.props.user.userProfile.concernMessages});
    }
  }
 
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user != this.props.user &&  this.props.user && this.props.user.userProfile) {
      this.setState({concernMessages: this.props.user.userProfile.concernMessages});
    } 
  }  


  render() {
    let userSection = (<div></div>);
    let signOutSection = null;
    let userLoginDisplay =  null;
    let concernMessage = null;
    let userProfileView = userProfileView = <UserProfileView ref={(userProfileView) => {this.userProfileView = userProfileView;}} openDialog={openDialog => this.openUserProfileDialog = openDialog}/>;
    const { user } = this.props;

    if(this.state.open) {
      if (user && user.user) {
        var imgURL = (user.userProfile.photoURL || '/images/profile_placeholder.png');
        userSection = (<div style={{alignItems: "center", display: "flex"}}>&nbsp;&nbsp;&nbsp;<img src={imgURL} style={{height:"20px", width:"20px"}}/>&nbsp;&nbsp;{user.userProfile.displayName}&nbsp;&nbsp;</div>);
        signOutSection = (<ListItem><SignOutButton/></ListItem>);
        if(this.state.concernMessages) {
          concernMessage = <EventListDialog title="關注" messageIds={this.state.concernMessages}/> 
        }
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
      }
    }

    return (
      <div>
        <IconButton 
          aria-label="More"
          aria-haspopup="true"
          onClick={() => this.handleToggle()}>
          <MoreVertIcon />
        </IconButton>
        {userProfileView}
        <AddressDialog ref={(addressDialog) => {this.addressDialog = addressDialog;}} openDialog={openDialog => this.openAddressDialog = openDialog}/>        
        <LeaderBoard />
        <AboutDialog openDialog={f => this.openAboutDialog = f}/>        
        <Drawer
          anchor="right" 
          open={this.state.open}
          onClose={() => this.handleClose()}
        >
          <div>
            <List>
              <ListItem>
              {userSection}
              </ListItem>
              {signOutSection}
            </List>
            <Divider/>
            <List disablePadding>            
              <ListItem button>
                <ListItemIcon>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText primary={constant.leaderBoardLabel} onClick={() => this.leaderBoardClick()}/>
              </ListItem>
              {concernMessage}
              {userLoginDisplay}                                                      
              <ListItem button>
                <ListItemIcon>
                  <ChatBubbleIcon />
                </ListItemIcon>
                <ListItemText primary="關於" onClick={() => this.showAbout()}/>
              </ListItem>                                                        
            </List>
          </div>                  
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    geoLocation : state.geoLocation,
    user: state.user
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLocation: () => dispatch(fetchLocation()),
    toggleAddressDialog: flag => dispatch(toggleAddressDialog(flag)),
    toggleLeaderBoard: flag => dispatch(toggleLeaderBoard(flag)),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(DrawerMenu);
