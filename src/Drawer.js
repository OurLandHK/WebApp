
import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import InboxIcon from 'material-ui-icons/Inbox';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Icon from 'material-ui/Icon';

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
    this.setState({open: false});
  }

  render() {
    return (
      <div>
        <IconButton onClick={() => this.handleToggle()}>
          <Icon>menu</Icon>
        </IconButton>
        <Drawer
          open={this.state.open}
          onRequestClose={() => this.handleClose()}
          onClick={() => this.handleClose()}
        >
          <div>
            <List disablePadding>
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Current" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Work" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Ladder" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="User Profile" />
              </ListItem>                                                        
            </List>
          </div>                  
        </Drawer>
      </div>
    );
  }
}

export default DrawerMenu;