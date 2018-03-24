/*global FB*/
import React, { Component } from 'react';
import * as firebase from 'firebase';
import config, {constant} from './config/default';
import Button from 'material-ui/Button';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import {connect} from "react-redux";
import Tabs, { Tab } from 'material-ui/Tabs';
import {
  toggleLeaderBoard,
  fetchTopTwenty,
} from './actions';

function Transition(props) {
  return <Slide direction="right" {...props} />;
}


const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};

class LeaderBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 0};
  }    

  componentWillMount() {
  
  }

  handleRequestClose = () => {
    this.props.toggleLeaderBoard(false);
  };

  handleChange = (event, value) => {
    this.setState({ value });
  }

  renderTopTwenty() {
    return (
      <div>
      </div>  
    );
  }
  
  render() {
    const { classes, open } = this.props;
    const { value } = this.state;
    return (
      <Dialog fullScreen  open={open} onRequestClose={this.handleRequestClose} transition={Transition} unmountOnExit>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              {constant.leaderBoardLabel}
            </Typography>          
          </Toolbar>
          <Tabs
            value={value}
            onChange={this.handleChange}
            fullWidth
          >
            <Tab label="頭二十名" />
            <Tab label="你的排名" />
          </Tabs>
        </AppBar>
        {value == 0 && this.renderTopTwenty()}
      </Dialog>);
  }
}

LeaderBoard.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    open: state.leaderBoard.open,
    topTwenty: state.leaderBoard.topTwenty,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLeaderBoard: flag => 
      dispatch(toggleLeaderBoard(flag)),
    fetchTopTwenty: () =>
      dispatch(fetchTopTwenty()),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LeaderBoard));
