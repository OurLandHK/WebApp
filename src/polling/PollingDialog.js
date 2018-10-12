import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { constant } from '../config/default';
import PollingView from './PollingView';
import PollingResultView from './PollingResultView';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  root: {
     paddingRight: 0
  },
  dialogTitle: {
    position: 'relative',
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
  },
  pollingContainer: {
    display: 'flex',
    height: '5rem',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class PollingDialog extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        open: false,
        disabledPolling: false,
      };
  }

  componentDidMount() {
    const { polling, user } = this.props;
    if(polling.result !== undefined && polling.result.length > 0) {
      polling.result.find((obj, index) => {
        if(obj.uid == user.user.uid) {
          this.setState({disabledPolling: true});
          return;
        }
      })
    }
  }

  handleRequestOpen(evt) {
    evt.preventDefault();
    this.setState({open: true});
  }

  handleRequestClose = () => {
    this.setState({open: false});
  };

  render() {
    const { classes, polling, messageUUID } = this.props;
    let buttonHtml = null;
    return (
      <span>
        <Paper role="button" onClick={(evt) => this.handleRequestOpen(evt)}>
          <Grid container className={classes.pollingContainer} spacing={16}>
            <Grid item >
              { this.state.disabledPolling? constant.disabledPollingLabel: constant.pollingLabel }
            </Grid>
          </Grid>
        </Paper>
        <Dialog
          fullScreen
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
          transition={Transition}
          unmountOnExit
        >
          <AppBar className={classes.dialogTitle}>
            <Toolbar className={classes.root}>
              <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
                <Typography variant="title" color="inherit" className={classes.flex}>
                  { this.state.disabledPolling ? constant.pollingResultLabel: constant.polling }</Typography>

            </Toolbar>
          </AppBar>
          { this.state.disabledPolling ? <PollingResultView polling={polling}/> : <PollingView polling={polling} messageUUID={messageUUID}/>}
        </Dialog>
      </span>
    );
  }
}

PollingDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  polling: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PollingDialog));
