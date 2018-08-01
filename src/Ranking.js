import React, { Component } from 'react';
import config, {constant} from './config/default';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import {fetchMessagesBaseOnGeo} from './MessageDB';
import { updatePublicProfileDialog} from './actions';
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
    if (geolocation == null) {
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
    if (this.props.filter.geolocation != prevProps.filter.geolocation ||
      this.props.filter.distance != prevProps.filter.distance ||
      this.props.filter.selectedSorting != prevProps.filter.selectedSorting) {
        this.refreshMessageList();
    } else {
      if(this.props.filter.selectedTag != undefined &&
            this.props.filter.selectedTag != prevProps.filter.selectedTag) {
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
    if(val == null) {
      this.setState({statusMessage: constant.messageListNoMessage});
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
    this.setState({geolocation: geolocation, statusMessage: constant.messageListLoadingStatus});
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
    const { classes } = this.props;
    return (
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
    );
  }

  render() {
    const classes = this.props.classes;
    let lon = 0;
    let lat = 0;

    if(this.state.geolocation != null && this.state.geolocation != constant.invalidLocation) {
      lon = this.state.geolocation.longitude;
      lat = this.state.geolocation.latitude;
    }
    if(this.state.data.length == 0) {
      let statusMessage = this.state.statusMessage;
      return(<div><h4>{statusMessage}</h4></div>);
    } else {
      let userList = {};
      for (let i in this.state.data) {
          let message = this.state.data[i];
          if(userList[message.uid] == null) {
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
        <div>
            {ranking.map((t, i) => {return this.renderUser(t, i + 1);})}
        </div>);        
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
