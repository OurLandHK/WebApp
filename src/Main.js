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
import { default as dist } from './Distance';
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
      let tagStatText = `「我地Ourland」有${tagStat[0].count}個${tagStat[0].tag}，${tagStat[1].count}個${tagStat[1].tag}，${actTag.count}個社區活動將會舉行，就等你同「我地」一齊更新我地的社區啦！`;
      return <p>{tagStatText}</p>
    } else {
      return null;
    } 
  }

  renderRandomFocusMessages() {
    const {globalFocusMessages: focusMessages} = this.props.ourland;
    if(focusMessages != null  && focusMessages.length > 0) {
      let focusMsgIdx = this.generateFocusMessagesIndex(focusMessages.length);
      return <div className="focus-message-wrapper">
          <h4>{focusMessages[focusMsgIdx].title}</h4>
          <MessageList
            ref={(messageList) => {this.messageList = messageList;}}
            eventNumber={100}
            distance={10}
            messageIds={focusMessages[focusMsgIdx].messages}
            hori={true}
          />
        </div>
    }else {
      return (null);
    }
  }

  generateFocusMessagesIndex(length) {
    // generating a random index for selecting a focus message item randomly
    // setting focusMsgIdx to state to avoid the value from being changed during re-rendering

    if(!length) return 0;
    let focusMsgIdx = null;
    if(this.state.focusMsgIdx == null) {
      focusMsgIdx = Math.floor((Math.random() * length));
      this.setState({focusMsgIdx})
      return focusMsgIdx;
    } else {
      return this.state.focusMsgIdx;
    }
  }


  renderMessageFrontPage() {
    let recentMessage = null;
    const { eventNumber, distance, geolocation, eventId, queryMessage, bookmark} = this.state;
    const {open: openRecent} = this.props.recentMessage;
//    const {focusMessages} = this.props.ourland;
    const {globalFocusMessages: focusMessages} = this.props.ourland;
    const { addressBook, classes } = this.props;

    let focusMessage = null
    let tagStatHtml = this.renderTagStat();
    let focusMessageHtml = null;

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

    // showing focus messages based on users' home address / office address within interested radius
    if(focusMessages != null  && focusMessages.length > 0 && addressBook != null && addressBook.addresses.length > 0) {
      // home
      var homeAddress = addressBook.addresses[0];
      var homeAddressInterestRadius = homeAddress.distance || 1;
      // office
      var officeAddress = addressBook.addresses[1];
      var officeAddressInterestRadius = officeAddress.distance || 1;

      // generating focus message html array 
      focusMessageHtml = focusMessages.map((focusMessage, focusMsgIdx) => {
        let homeAddressDistDiff = null;
        let officeAddressDistDiff = null;

        if(homeAddress.geolocation != null) {
          homeAddressDistDiff = dist(focusMessage.geolocation.longitude, focusMessage.geolocation.latitude, homeAddress.geolocation.longitude, homeAddress.geolocation.latitude);
        }

        if(officeAddress.geolocation) {
          officeAddressDistDiff = dist(focusMessage.geolocation.longitude, focusMessage.geolocation.latitude, officeAddress.geolocation.longitude, officeAddress.geolocation.latitude);
        }

        if((homeAddressDistDiff != null && homeAddressDistDiff < homeAddressInterestRadius) || (officeAddressDistDiff != null && officeAddressDistDiff < homeAddressInterestRadius) ) {
          return (
            <div key={focusMsgIdx}>
              <h4>{focusMessages[focusMsgIdx].title}</h4>
              <MessageList
                ref={(messageList) => {this.messageList = messageList;}}
                eventNumber={100}
                distance={10}
                messageIds={focusMessages[focusMsgIdx].messages}
                hori={true}
              />
            </div>
          ) 
        } else {
          return null;
        }
      });

      // filtering out null cases
      focusMessageHtml = focusMessageHtml.filter(x => !!x);

      if(focusMessageHtml.length > 0) {
        // generating focus message
        // if there are more than one hit, one of them will be selected randomly
        let focusMsgIdx = this.generateFocusMessagesIndex(focusMessageHtml.length);

        focusMessage = 
          <div className="focus-message-wrapper">
            {focusMessageHtml[focusMsgIdx]}
          </div>
      } else {
        // no nearby focusMessage within user's addresses 
        // generating one randomly from the focus message pool
        focusMessage = this.renderRandomFocusMessages();
      } 
    } else {
      // no address book for guests
      // generating one randomly from the focus message pool
      focusMessage = this.renderRandomFocusMessages();
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
    addressBook: state.addressBook
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
