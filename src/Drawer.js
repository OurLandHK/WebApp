
import React, { Component } from 'react';
import * as firebase from 'firebase';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import InboxIcon from 'material-ui-icons/Inbox';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Icon from 'material-ui/Icon';
import UserProfileView from './UserProfileView'
import {getUserProfile} from './UserProfile';

const currentLocationLabel = "現在位置";
const officeLocationLabel = "辦公室位置";
const homeLocationLabel = "屋企位置";

class DrawerMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle(){
    //console.log('Toggle Drawer: ' + this.state.open);
    this.setState({open: !this.state.open});
  }
  handleClose(){
    //console.log('Closed Drawer');
    this.setState({open: false});
  }

  userProfileClick(){
    this.handleClose();
    this.openUserProfileDialog();
  }

  currentClick() {
    this.props.header.setLocation(currentLocationLabel, 0, 0);
    this.handleClose();
  }  

  homeClick() {
    var auth = firebase.auth();
    console.log(auth);
    auth.onAuthStateChanged((user) => {
      if (user) {
        getUserProfile(user).then((userProfile)=>{
          this.props.header.setLocation(homeLocationLabel, userProfile.homeLocationLongitude, userProfile.homeLocationLatitude);
          this.handleClose();
        });
      } else {
        this.handleClose();
      }
    });
  }  

  officeClick() {
    var auth = firebase.auth();
    console.log(auth);
    auth.onAuthStateChanged((user) => {
      if (user) {
        getUserProfile(user).then((userProfile)=>{
          this.props.header.setLocation(officeLocationLabel, userProfile.officeLocationLongitude, userProfile.officeLocationLatitude);
          this.handleClose();
        });
      } else {
        this.handleClose();
      }
    });
  }  

  render() {
    return (
      <div>
        <IconButton onClick={() => this.handleToggle()}>
          <Icon>menu</Icon>
        </IconButton>
        <UserProfileView ref={(userProfileView) => {this.userProfileView = userProfileView;}} openDialog={openDialog => this.openUserProfileDialog = openDialog}/>        
        <Drawer
          open={this.state.open}
          onRequestClose={() => this.handleClose()}          
        >
          <div>
            <List disablePadding>
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={currentLocationLabel} onClick={() => this.currentClick()}/>
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="關注" onClick={() => this.handleClose()}/>
              </ListItem>              
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={homeLocationLabel} onClick={() => this.homeClick()}/>
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={officeLocationLabel} onClick={() => this.officeClick()}/>
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Ladder" onClick={() => this.handleClose()}/>
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="User Profile" onClick={() => this.userProfileClick()}/>
              </ListItem>                                                        
            </List>
          </div>                  
        </Drawer>
      </div>
    );
  }
}

export default DrawerMenu;
