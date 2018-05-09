/*global FB*/
import React, { Component } from 'react';
import * as firebase from 'firebase';
import config, {constant} from '../config/default';
import Button from 'material-ui/Button';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from 'material-ui/transitions/Slide';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import AddressList from './AddressList';
import AddressView from './AddressView';
import {connect} from "react-redux";
import { toggleAddressDialog } from '../actions';

function Transition(props) {
  return <Slide direction="left" {...props} />;
}


const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  container: {
   overflowY: 'auto'
  }
};

class AddressDialog extends React.Component {
  constructor(props) {
    super(props);
    this.props.openDialog(this.openDialog);
  }    

  handleRequestClose = () => {
    this.props.toggleAddressDialog(false);
  };

  
  render() {
    const { classes, open } = this.props;
    return (
      <Dialog fullScreen  open={open} onRequestClose={this.handleRequestClose} transition={Transition} unmountOnExit>
        <AppBar className={classes.appBar}>
             <Toolbar>
                    <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="title" color="inherit" className={classes.flex}>{constant.addressBookLabel}</Typography>           
                </Toolbar>
            </AppBar>
            <div className={classes.container}>
            <AddressList/>
            <AddressView/>
            </div>
        </Dialog>);
  }
}

AddressDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    open: state.addressDialog.open,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleAddressDialog: flag => 
      dispatch(toggleAddressDialog(flag)),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddressDialog));
