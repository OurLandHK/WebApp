import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import React, { Component } from 'react';
import SignInButton from './SignInButton';
import DrawerMenu from './Drawer';
import AppBar from 'material-ui/AppBar';

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
              <AppBar
                title={<span style={this.styles.title}>Ourland HK</span>}
                iconElementLeft={<DrawerMenu/ >}>
                <div style={{alignItems: "center", display: "flex"}}>
 									<SignInButton/>
                </div>
              </AppBar>
            </div>);
  }
}

export default Header;
