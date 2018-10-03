import { withStyles } from '@material-ui/core/styles';
import NearbyEventDialog from './NearbyEventDialog';
import RegionEventDialog from './RegionEventDialog';
import MessageView from './MessageView';
import BookmarkView from './bookmark/BookmarkView';
import {getMessage} from './MessageDB';
import {getBookmark} from './UserProfile';
import React, { Component } from 'react';
import {constant} from './config/default';
import FocusMessage from './FocusMessage';
import {trackEvent} from  './track';

import {
  updateRecentMessage,
  updatePublicProfileDialog,
  updateRecentBookmark,
} from './actions';
import {connect} from 'react-redux';

const styles = () => ({
  container: {
  },

  contentWrapper: {
    marginBottom: '40px'
  }
});

class Main extends Component {
  constructor(props) {
    super(props);
    let geolocation = this.props.geolocation;
    this.init = true;
    if(geolocation === null) {
      geolocation = constant.invalidLocation;
    }
    this.state = {
        userId: this.props.userId,
        eventId: this.props.eventId,
        eventNumber: this.props.eventNumber,
        distance: this.props.distance,
        geolocation: this.props.geolocation
      };

  }


  handleClick() {
    this.openDialog();
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.init || this.props.recentMessage !== prevProps.recentMessage) {
      this.init = false;
      this.refreshQueryMessage();
    }
  }

  componentDidMount() {
    trackEvent('main', 'main');
  }

  refreshQueryMessage() {
    const {id, bookmark} = this.props.recentMessage;
    console.log("eventID: " + id + "  bookmark" + bookmark);
    if(id !== "") {
      console.log("eventID: " + id);
      getMessage(id).then((message) => {this.setState({queryMessage: message, bookmark: null})});
    } else {
      if(bookmark.bookmark !== "") {
        console.log("bookmark: " + bookmark.bookmark);
        let user = {uid: bookmark.uid};
        getBookmark(user, bookmark.bookmark).then((bookmarkMessage) => {this.setState({queryMessage: null, bookmark: bookmarkMessage})});
      }
      this.queryMessage = null;
    }
  }

  renderTagStat() {
    const {tagStat} = this.props.ourland;
    if(tagStat.length > 3) {
      let actTag = null;
      for(let i = 0; i < tagStat.length; i++) {
        if(tagStat[i].tag === '活動') {
          actTag = tagStat[i];
        }
      }
      let tagStatText = `「我地Ourland」有${tagStat[0].count}個${tagStat[0].tag}，${tagStat[1].count}個${tagStat[1].tag}，${actTag.count}個社區活動將會舉行，就等你同「我地」一齊更新我地的社區啦！`;
      return <marquee style={{color: '#3f51b5', fontWeight: 'bold', textAlign: 'center', padding: '10px'}}>{tagStatText}</marquee>
    } else {
      return null;
    }
  }

  renderMessageFrontPage() {
    let recentMessage = null;
    const { eventNumber, distance, geolocation, queryMessage, bookmark} = this.state;
    const {open: openRecent} = this.props.recentMessage;
    const { classes } = this.props;
    let tagStatHtml = this.renderTagStat();

    if (queryMessage && openRecent) {
      let message = queryMessage;
      recentMessage = <div className="recent-event-wrapper">
                        <h4>{constant.recentEventLabel}</h4>
                        <MessageView message={message} key={message.key} openDialogDefault={openRecent} />
                      </div>;
    } else if (bookmark && openRecent) {
      recentMessage = <div className="recent-event-wrapper">
                        <h4>{constant.recentEventLabel}</h4>
                        <BookmarkView bookmark={bookmark} open={openRecent} />
                      </div>;
    }
    let messageList = <NearbyEventDialog
            eventNumber={eventNumber}
            distance={distance}
            geolocation={geolocation}
          />
    return (
      <div className={classes.container}>
        {tagStatHtml}
        {recentMessage}
        <FocusMessage/>
        {messageList}
      </div>
    );
  }

  render() {
    let messageHtml = this.renderMessageFrontPage();
    const { classes } = this.props;
    return (
      <div className={classes.contentWrapper}>
          {messageHtml}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    recentMessage : state.recentMessage,
    ourland : state.ourland,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateRecentMessage:
      (recentMessageID, open) =>
        dispatch(updateRecentMessage(recentMessageID, open)),
    updateRecentBookmark:
      (userId, bookmark, open) =>
        dispatch(updateRecentBookmark(userId, bookmark, open)),
    updatePublicProfileDialog:
      (userId, fbuid, open) =>
        dispatch(updatePublicProfileDialog(userId, fbuid, open)),
  }
};


export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Main));
