import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import React, { Component } from 'react';
import SignInButton from './SignInButton';

class Header extends  Component {

  render() {
    return (<div>
              <Navbar color="faded" light toggleable>
                <NavbarBrand>Our Land</NavbarBrand>
								<Nav className="ml-auto" navbar>
		              <NavItem>
										<SignInButton/>
    		          </NavItem>
								</Nav>
              </Navbar>     
            </div>);
  }
}

export default Header;
