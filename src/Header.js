import React, { Component } from 'react';
import SignInButton from './SignInButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import {connect} from "react-redux";
import {constant} from "./config/default";
import {fetchLocation, toggleSearchEventDialog} from "./actions";
import NotificationsDialog from "./NotificationsDialog";
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  searchInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
  },
});



class Header extends Component {
  constructor(props) {
    super(props);
  }

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
    return (<AppBar className="header">
              <Toolbar>
                <div className="header-title" onClick={() => {window.location.href = homeUrl}}>
                  我地.市正
                </div>
                <SignInButton/>
                <TextField id={constant.searchLabel} className={classes.searchInput} variant="outlined"  fullWidth margin="normal" value={constant.searchLabel} endAdornment={<InputAdornment position="end"><SearchIcon/></InputAdornment>} onClick={() => this.props.toggleSearchEventDialog(true)}/>
                <NotificationsDialog/>
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
