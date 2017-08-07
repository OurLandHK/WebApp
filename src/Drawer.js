import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

export default class DrawerMenu extends React.Component {

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
        <RaisedButton  label="Open Drawer" onTouchTap={this.handleToggle}/>
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <MenuItem onTouchTap={this.handleClose}>Current</MenuItem>
          <MenuItem onTouchTap={this.handleClose}>Home</MenuItem>
          <MenuItem onTouchTap={this.handleClose}>Work</MenuItem>
          <MenuItem onTouchTap={this.handleClose}>Ladder</MenuItem>  
          <MenuItem onTouchTap={this.handleClose}>User Profile</MenuItem>                     
        </Drawer>
      </div>
    );
  }
}