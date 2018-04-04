import React, { Component } from 'react';
import * as firebase from 'firebase';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import InboxIcon from 'material-ui-icons/Inbox';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Icon from 'material-ui/Icon';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import StarIcon from 'material-ui-icons/Star';
import LocationOn from 'material-ui-icons/LocationOn';
import ChatBubbleIcon from 'material-ui-icons/ChatBubbleOutline';
import PersonIcon from 'material-ui-icons/Person';
import UserProfileView from './UserProfileView';
import AddressDialog from './address/AddressDialog';
import LeaderBoard from './LeaderBoard';
import {connect} from "react-redux";
import Divider from 'material-ui/Divider';
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


  render() {
    let userSection = (<div></div>);
    let signOutSection = null;
    const { user } = this.props;

    if (user) {
      var imgURL = (user.photoURL || '/images/profile_placeholder.png');
      userSection = (<div style={{alignItems: "center", display: "flex"}}>&nbsp;&nbsp;&nbsp;<img src={imgURL} style={{height:"20px", width:"20px"}}/>&nbsp;&nbsp;{user.displayName}&nbsp;&nbsp;</div>);
      signOutSection = (<ListItem><SignOutButton/></ListItem>);
    }

    return (
      <div>
        <IconButton 
          aria-label="More"
          aria-haspopup="true"
          onClick={() => this.handleToggle()}>
          <MoreVertIcon />
        </IconButton>
        <UserProfileView ref={(userProfileView) => {this.userProfileView = userProfileView;}} openDialog={openDialog => this.openUserProfileDialog = openDialog}/>        
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
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="關注" onClick={() => this.handleClose()}/>
              </ListItem>              
              <ListItem button>
                <ListItemIcon>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText primary={constant.leaderBoardLabel} onClick={() => this.leaderBoardClick()}/>
              </ListItem>
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
              </ListItem>                                                        
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
