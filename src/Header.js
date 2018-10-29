import React, { Component } from 'react';
import SignInButton from './SignInButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import CardMedia from '@material-ui/core/CardMedia';
import {connect} from "react-redux";
import {constant} from "./config/default";
import {fetchLocation, toggleSearchEventDialog} from "./actions";
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  searchInput: {
    borderRadius: '10px',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    flex: 1
  },
  cover: {
    width: 64,
    height: 64,
  },
  dialogTitle: {
    background: 'linear-gradient(to bottom, #006fbf  50%, #014880 50%)',
  },
  flex: {

  }
});



class Header extends Component {
  handleLeftTouchTap() {
    console.log('Open Drawer');
    alert('onTouchTap triggered on the title component');
    this.drawerMenu.handleToggle();
  }

  componentDidMount() {
  }

  errorCallBack(error) {
    console.warn(`ERROR(${error.code}): ${error.message}`);
  }

  render() {
    const { classes } = this.props;
    let homeUrl = window.location.protocol + "//" + window.location.hostname;
    return (<AppBar className={classes.dialogTitle}>
              <Toolbar>
                <CardMedia className={classes.cover}  image={"/images/我地市正Logo-01.png"} onClick={() => {window.location.href = homeUrl}}/>
                <SignInButton/>
                <TextField id={constant.searchLabel} className={classes.searchInput} variant="outlined"  fullWidth margin="normal" value={constant.searchLabel} onClick={() => this.props.toggleSearchEventDialog(true)}/>
              </Toolbar>
            </AppBar>);
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    geoLocation : state.geoLocation,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSearchEventDialog: flag =>
      dispatch(toggleSearchEventDialog(flag)),
    fetchLocation: () => dispatch(fetchLocation())
  }
};


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Header));
