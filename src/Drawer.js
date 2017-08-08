
import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

class DrawerMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle(){
    console.log('Toggle Drawer: ' + this.state.open);
    this.setState({open: !this.state.open});
  }
  handleClose = () => this.setState({open: false});

  render() {
    return (
      <div>
        <IconButton onClick={() => this.handleToggle()}>
          <FontIcon className="material-icons" >menu</FontIcon>
        </IconButton>
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <MenuItem onClick={this.handleClose}>Current</MenuItem>
          <MenuItem onClick={this.handleClose}>Home</MenuItem>
          <MenuItem onClick={this.handleClose}>Work</MenuItem>
          <MenuItem onClick={this.handleClose}>Ladder</MenuItem>  
          <MenuItem onClick={this.handleClose}>User Profile</MenuItem>                     
        </Drawer>
      </div>
    );
  }
}

export default DrawerMenu;