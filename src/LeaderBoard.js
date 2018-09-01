/*global FB*/
import React, { Component } from 'react';
import * as firebase from 'firebase';
import config, {constant, RoleEnum} from './config/default';
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
import {checkImageExists} from './util/http';
import {connect} from "react-redux";
import Ranking from "./Ranking";
import UserList from "./admin/UserList";
import Tab  from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import FilterBar from './FilterBar';
import {
  toggleLeaderBoard,
  fetchTopTwenty,
  updatePublicProfileDialog,
  updateFilterWithCurrentLocation,
} from './actions';

function Transition(props) {
  return <Slide direction="left" {...props} />;
}

const styles = {
  container: {
    overflowY: 'auto'
  }
};

class LeaderBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 'current'};
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
    var imgURL = '/images/profile_placeholder.png';
    if(checkImageExists(user.photoURL)) {
      imgURL = user.photoURL;
    } 
    return (
      <div>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar
                className={classes.avatar}
                src={imgURL}
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

  renderNearby() {
    const { classes } = this.props;
    return (
        <div>
          <FilterBar ranking={true} />
          <div className={classes.container}>
            <Ranking
              ref={(ranking) => {this.ranking = ranking}}
              distance='1'
              geolocation={constant.invalidLocation}
            />
          </div>
        </div>
    );
  }


  render() {
    const { classes, open, user } = this.props;
    const { value } = this.state;
    let listHtml = null;
    let allUser = null;
    if(user.userProfile != null && user.userProfile.role == RoleEnum.admin) {
      allUser = <Tab label="Admin" value="admin"/>;
    }
    switch(value) {
      case 'current':
        listHtml = this.renderNearby();
        break;
      case 'hktop':
        listHtml = this.renderTopTwenty();
        break;
      case 'admin':
        listHtml = <UserList />;
        break;      
    } 
    return (
      <div class="leaderboard-wrapper">
        <div class="tabs-row">
          <Tabs
            value={value}
            onChange={this.handleChange}
            fullWidth
          >
            <Tab label="附近排名" value="current"/>
            <Tab label="全港頭二十名" value="hktop"/>
            {allUser}
          </Tabs>
        </div>
        {listHtml}
      </div>);
  }
}

LeaderBoard.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    open: state.leaderBoard.open,
    topTwenty: state.leaderBoard.topTwenty,
    user: state.user,
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
    updateFilterWithCurrentLocation:
      () => dispatch(updateFilterWithCurrentLocation()),        
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LeaderBoard));
