import { withStyles } from '@material-ui/core/styles';
import NearbyEventDialog from './NearbyEventDialog';
import RegionEventDialog from './RegionEventDialog';
import MessageView from './MessageView';
import BookmarkView from './bookmark/BookmarkView';
import {getMessage} from './MessageDB';
import {getBookmark} from './UserProfile';
import React, { Component } from 'react';
import MessageList from './MessageList';
import config, {constant} from './config/default';
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
    const { updateRecentMessage, updatePublicProfileDialog, updateRecentBookmark } = this.props;
    if(geolocation == null) {
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
    if (this.init || this.props.recentMessage != prevProps.recentMessage) {
      this.init = false;
      this.refreshQueryMessage();
    }
  }

  refreshQueryMessage() {
    const {id, bookmark} = this.props.recentMessage;
    console.log("eventID: " + id + "  bookmark" + bookmark);
    if(id != "") {
      console.log("eventID: " + id);
      getMessage(id).then((message) => {this.setState({queryMessage: message, bookmark: null})});
    } else {
      if(bookmark.bookmark != "") {
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
        if(tagStat[i].tag == '活動') {
          actTag = tagStat[i];
        }
      }
      let tagStatText = `我地有${tagStat[0].count}個${tagStat[0].tag}，${tagStat[1].count}個${tagStat[1].tag}，${actTag.count}個社區活動將會舉行，你會唔會有一d我地冇既野呢?`;
      return <p>{tagStatText}</p>
    } else {
      return null;
    } 
  }

  renderMessageFrontPage() {
    let recentMessage = null;
    const { eventNumber, distance, geolocation, eventId, queryMessage, bookmark} = this.state;
    const {open: openRecent} = this.props.recentMessage;
//    const {focusMessages} = this.props.ourland;
    const {globalFocusMessages: focusMessages} = this.props.ourland;
    const { classes } = this.props;
    let focusMessage = null
    let tagStatHtml = this.renderTagStat();
    if(queryMessage != null) {
      let message = queryMessage;
      recentMessage = <div className="recent-event-wrapper">
                        <h4>{constant.recentEventLabel}</h4>
                        <MessageView message={message} key={message.key} openDialogDefault={openRecent} />
                      </div>;
    } else if(bookmark != null) {
      recentMessage = <div className="recent-event-wrapper">
                        <h4>{constant.recentEventLabel}</h4>
                        <BookmarkView bookmark={bookmark} open={openRecent} />
                      </div>;
    }
    if(focusMessages != null && focusMessages.length > 0 && focusMessages[0].messages.length) {
      focusMessage = <div className="focus-message-wrapper">
        <h4>{focusMessages[0].title}</h4>
        <MessageList
          ref={(messageList) => {this.messageList = messageList;}}
          eventNumber={100}
          distance={10}
          messageIds={focusMessages[0].messages}
          hori={true}
        />
      </div>
    }

    return (
      <div className={classes.container}>
        {tagStatHtml}
        {recentMessage}
        {focusMessage}       
        <RegionEventDialog
          eventNumber={eventNumber}
          distance={distance}
          geolocation={geolocation}
        />
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


export default connect(
  mapStateToProps,
  mapDispatchToProps
)
(withStyles(styles)(Main));
