import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import React, { Component } from 'react';
import SignInButton from './SignInButton';
import AppBar from 'material-ui/AppBar';

class Header extends  Component {

  render() {
    var style = {marginRight: 20};
    return (<div>
              <AppBar title="Ourland HK">
                <div style={{alignItems: "center", display: "flex"}}>
 									<SignInButton/>
                </div>
              </AppBar>
            </div>);
  }
}

export default Header;
