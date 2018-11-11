import React, { Component } from 'react';
import {constant} from './config/default';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import {fetchMessagesBaseOnGeo} from './MessageDB';
import { updatePublicProfileDialog} from './actions';
import {checkImageExists} from './util/http';
import {connect} from "react-redux";
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  scrollingWrapper: {
    overflowX: 'scroll',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
  },

  scrollingItem: {
      display: 'inline-block',
  },
  container: {
    overflowY: 'auto'
  }
});

class Ranking extends Component {
  constructor(props) {
    super(props);
    let geolocation = this.props.geolocation;
    if (geolocation === null) {
      geolocation = constant.invalidLocation;
    }
    let statusMessage = constant.messageListReadingLocation;
    this.state = {
      distance: this.props.distance,
      geolocation: geolocation,
      data:[],
      selectedTag: null,
      selectedSorting: null,
      statusMessage: statusMessage,
    };
    this.setMessage = this.setMessage.bind(this);
    this.clear = this.clear.bind(this);
    this.openPublicProfileDialog = this.openPublicProfileDialog.bind(this);
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.filter.geolocation !== prevProps.filter.geolocation ||
      this.props.filter.distance !== prevProps.filter.distance ||
      this.props.filter.selectedSorting !== prevProps.filter.selectedSorting) {
        this.refreshMessageList();
    } else {
      if(this.props.filter.selectedTag !== undefined &&
            this.props.filter.selectedTag !== prevProps.filter.selectedTag) {
        this.setState({selectedTag: this.props.filter.selectedTag});
      }
    }
  }

  refreshMessageList() {
    this.setState({
      selectedTag: null,
      selectedSorting: null});
    this.fetchMessages(this.props.filter);
  }

  setMessage(val) {
    if(val === null) {
      this.setState({statusMessage: constant.rankingListNoMessage});
      return;
    }
    this.state.data.push(val);
    this.setState({data:this.state.data});
  };

  clear() {
    //console.log("clear  message list")
    this.setState({data: []});
  }


  fetchMessages(filter) {
    const {
     eventNumber: numberOfMessage,
     distance,
     geolocation
    } = filter;
    this.setState({geolocation: geolocation, statusMessage: constant.rankingListLoadingStatus});
    //console.log("Fetch MessageIDs: " + this.state.messageIds);
    this.clear();
    switch (geolocation) {
    case constant.invalidLocation:
        this.setState({statusMessage: constant.messageListBlockLocation});
        break;
    case constant.timeoutLocation:
        this.setState({statusMessage: constant.messageListTimeOut});
        break;
    default:
        //console.log("fetchMessagesBaseOnGeo");
        fetchMessagesBaseOnGeo(geolocation, distance, numberOfMessage, null, this.props.tagFilter, this.setMessage);
        break;
    }
  }

  openPublicProfileDialog(uid, fbuid) {
    const {updatePublicProfileDialog} = this.props;
    if (uid) {
      updatePublicProfileDialog(uid, fbuid, true)
    }
  };

  renderUser(user, rank) {
    const { classes} = this.props;
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
        subheader={`${user.displayName}發佈了${user.count}項社區事項`}
        onClick={() => this.openPublicProfileDialog(user.id, user.fbuid)}
        />
    </Card>
    );
  }

  render() {
    if(this.state.data.length === 0) {
      let statusMessage = this.state.statusMessage;
      return(<h4>{statusMessage}</h4>);
    } else {
      let userList = {};
      for (let i in this.state.data) {
          let message = this.state.data[i];
          if(userList[message.uid] === undefined || userList[message.uid] === null) {
            userList[message.uid] = {id: message.uid,
                                    fbuid: message.fbuid,
                                    count: 1,
                                    displayName: message.name,
                                    photoURL: message.photoUrl};
          } else {
            userList[message.uid].count++;
          }
      }
      let ranking = Object.values(userList);

      ranking.sort((i, j) => (j.count) - (i.count));
      return (
        <React.Fragment>
            {ranking.map((t, i) => {return this.renderUser(t, i + 1);})}
        </React.Fragment>);
    }
  }
};

Ranking.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    filter : state.filter,
    geolocation: state.geolocation,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updatePublicProfileDialog:
      (userId, fbuid, open) =>
        dispatch(updatePublicProfileDialog(userId, fbuid, open)),
  }
};


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Ranking));
