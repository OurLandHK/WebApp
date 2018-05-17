/*global FB*/
import React, { Component } from 'react';
import * as firebase from 'firebase';
import config, {constant} from './config/default';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText  from '@material-ui/core/ListItemText';
import {connect} from "react-redux";
import Tab  from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import {
  toggleLeaderBoard,
  fetchTopTwenty,
  updatePublicProfileDialog,
} from './actions';

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

class LeaderBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 0};
    this.openPublicProfileDialog = this.openPublicProfileDialog.bind(this);
  }    

  componentWillMount() {
    this.props.fetchTopTwenty(); 
  }

  handleRequestClose = () => {
    this.props.toggleLeaderBoard(false);
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

   openPublicProfileDialog(uid, fbuid) {
    const {updatePublicProfileDialog} = this.props;
    if (uid) {
      updatePublicProfileDialog(uid, fbuid, true)
    }
  };

  renderUser(user, rank) {
    const { classes } = this.props;
    return (
      <div>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar
                className={classes.avatar}
                src={user.photoURL}
              />
            }
            title={`第${rank}名`}
            subheader={user.displayName}
            onClick={() => this.openPublicProfileDialog(user.id, user.fbuid)}
          />
        </Card>
      </div>
    );
  }

  renderTopTwenty() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        {this.props.topTwenty.map((t, i) => this.renderUser(t, i + 1))}
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
    updatePublicProfileDialog:
      (userId, fbuid, open) =>
        dispatch(updatePublicProfileDialog(userId, fbuid, open)),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LeaderBoard));
