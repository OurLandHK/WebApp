import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import React, { Component } from 'react';
import SignInButton from './SignInButton';
import DrawerMenu from './Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

class Header extends  Component {
  constructor(props) {
    super(props);
    this.drawerMenu = new DrawerMenu();
  }

  handleLeftTouchTap() {
    console.log('Open Drawer');
    alert('onTouchTap triggered on the title component');
    this.drawerMenu.handleToggle();
  }

  styles = {
    title: {
      cursor: 'pointer',
    },
  };

  render() {
    var style = {marginRight: 20};
    return (<div>
              <AppBar position="static">
                <Toolbar>
                  <DrawerMenu/ >
                  <Typography type="title" color="inherit" flex="1">
                    Ourland HK
                  </Typography>
                  <SignInButton/>
                </Toolbar>
              </AppBar>      
            </div>);
  }
}

export default Header;
