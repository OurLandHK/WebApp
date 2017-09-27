
import React, { Component } from 'react';
import SignInButton from './SignInButton';
import DrawerMenu from './Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styles = {
  root: {
    marginTop: 1,
    width: '100%',
  },
  flex: {
    flex: 1,
  },
};


class Header extends  Component {
  constructor(props) {
    super(props);
  }

  handleLeftTouchTap() {
    console.log('Open Drawer');
    alert('onTouchTap triggered on the title component');
    this.drawerMenu.handleToggle();
  }

  render() {
    const classes = this.props.classes;
    return (<div className={classes.root}>
              <AppBar position="static">
                <Toolbar>
                  <DrawerMenu ref={(drawerMenu) => {this.drawerMenu = drawerMenu;}} />
                  <Typography type="title" color="inherit" className={classes.flex}>
                    Ourland HK
                  </Typography>
                  <SignInButton/>
                </Toolbar>
              </AppBar>      
            </div>);
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
//export default Header;
