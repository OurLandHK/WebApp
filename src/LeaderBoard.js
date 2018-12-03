import React from 'react';
import {constant, RoleEnum} from './config/default';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {checkImageExists} from './util/http';
import {connect} from "react-redux";
import Ranking from "./Ranking";
import UserList from "./admin/UserList";
import Tab  from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import BookmarkList from './bookmark/BookmarkList';
import FilterBar from './FilterBar';
import {
  toggleLeaderBoard,
  fetchTopTwenty,
  updatePublicProfileDialog,
  updateFilterWithCurrentLocation,
} from './actions';

const styles = {
  container: {
    overflowY: 'auto'
  }
};

class LeaderBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: constant.publicBookmarkLabel};
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
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar
              className={classes.avatar}
              src={imgURL}
            />
          }
          title={`第${rank}名`}
          subheader={`${user.displayName}發佈了${user.publishMessagesCount}項社區事項`}
          onClick={() => this.openPublicProfileDialog(user.id, user.fbuid)}
        />
      </Card>
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
        <React.Fragment>
          <FilterBar ranking={true} filterID="LeaderBoard"/>
          <div className={classes.container}>
            <Ranking
              ref={(ranking) => {this.ranking = ranking}}
              distance='1'
              geolocation={constant.invalidLocation}
            />
          </div>
        </React.Fragment>
    );
  }

  renderPublicMessages() {
    const { classes, ourland } = this.props;

    return (
      <div className={classes.container}>
        <BookmarkList bookmarkList={ourland.bookmarkList}/>
      </div>
    );
  }


  render() {
    const { user } = this.props;
    const { value } = this.state;
    let listHtml = null;
    let allUser = null;
    if(user.userProfile  != null  && user.userProfile.role === RoleEnum.admin) {
      allUser = <Tab label="Admin" value="admin"/>;
    }
    switch(value) {
      case constant.publicBookmarkLabel:
        listHtml = this.renderPublicMessages();
        break;
      case 'current':
        listHtml = this.renderNearby();
        break;
      case 'hktop':
        listHtml = this.renderTopTwenty();
        break;
      case 'admin':
        listHtml = <UserList />;
        break;
      default:
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
            <Tab label={constant.publicBookmarkLabel} value={constant.publicBookmarkLabel}/>
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
    ourland: state.ourland,
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
      (filterID) => dispatch(updateFilterWithCurrentLocation(filterID)),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LeaderBoard));
