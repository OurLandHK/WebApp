/*global FB*/
import React from 'react';
import {constant} from '../config/default';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
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
    background: 'linear-gradient(to bottom, #006fbf  50%, #014880 50%)',
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
