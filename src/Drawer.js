
import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import InboxIcon from 'material-ui-icons/Inbox';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Icon from 'material-ui/Icon';
import UserProfileView from './UserProfileView'

class DrawerMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle(){
    console.log('Toggle Drawer: ' + this.state.open);
    this.setState({open: !this.state.open});
  }
  handleClose(){
    console.log('Closed Drawer');
    this.setState({open: false});
  }

  userProfileClick(){
    this.handleClose();
    this.openUserProfileDialog();
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
                <ListItemText primary="Current" onClick={() => this.handleClose()}/>
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="關注" onClick={() => this.handleClose()}/>
              </ListItem>              
              <ListItem button component="a" href="/">
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Home" onClick={() => this.handleClose()}/>
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Work" onClick={() => this.handleClose()}/>
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
