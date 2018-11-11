import React from 'react';
import {constant, addressEnum, RoleEnum} from './config/default';
import MessageView from './MessageView';
import BookmarkView from './bookmark/BookmarkView';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MessageList from './MessageList';
import MissionView from './mission/MissionView';
import FilterBar from './FilterBar';
import {fetchMessagesBaseOnGeo, fetchReportedUrgentMessages, fetchMessagesBasedOnInterestedTags, getMessage} from './MessageDB';
import {getBookmark} from './UserProfile';
import {
  toggleAddressDialog,
} from "./actions";
import {connect} from "react-redux";

const styles = {
    appBar: {
      position: 'relative',
    },
    flex: {
      flex: 1,
    },
    container: {
       overflowY: 'auto'
    },
    media: {
      color: '#fff',
      position: 'relative',
      height: '10rem',
    },
    mediaCredit: {
      position:'absolute',
      bottom:'0',
      right:'0',
      fontSize:'0.5rem',
    }
  };

class NotificationsDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messageIds: [],
      open: false,
      messageIdsLength: 0,
    };
    this.setMessage = this.setMessage.bind(this);
    this.clear = this.clear.bind(this);
    this.init =true;
  }

  componentDidMount() {
    if(this.props.user && this.props.user.lastLogin) {
      this.refreshMessageList();
    }
  }



  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user !== this.props.user &&  this.props.user && this.props.user.lastLogin && this.state.messageIds.length === 0) {
      this.refreshMessageList();
    }
    if (this.init || this.props.recentMessage !== prevProps.recentMessage) {
      this.init = false;
      this.refreshQueryMessage();
    }
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

  refreshMessageList() {
    this.fetchMessages();
  }

  setMessage(val) {
    if(val === null) {
      return;
    }
    let messageIds = this.state.messageIds;
    const messageUUID = val.key;
    var index = messageIds.indexOf(messageUUID);
    if(index === -1)
    {
      messageIds.push(messageUUID);
    }
    console.log(messageUUID);
    this.setState({messageIds: messageIds});
  }

  clear() {
    this.setState({messageIds: []});
  }


  fetchMessages() {
    this.clear();
    const { addressBook, user} = this.props;
    const lastLoginTime = user.lastLogin;
    addressBook.addresses.map((address) => {
      if(address.geolocation  != null  && (address.type === addressEnum.home || address.type === addressEnum.office)) {
        let distance = (address.distance != null ) ? address.distance : constant.distance;
        if(user.userProfile.role === RoleEnum.admin) {
          distance = 100;
        }
        if(user.userProfile.role === RoleEnum.admin || user.userProfile.role === RoleEnum.monitor) {
          fetchReportedUrgentMessages(this.setMessage);
        }
        // If user didn't config all interested Tag, assume they should receive all.
        if(user.userProfile.interestedTags  != null  && user.userProfile.interestedTags.length > 0) {
          fetchMessagesBasedOnInterestedTags(user.userProfile.interestedTags, address.geolocation, distance, lastLoginTime, this.setMessage);
        } else {
          fetchMessagesBaseOnGeo(address.geolocation, distance, constant.defaultEventNumber, lastLoginTime, null, this.setMessage);
        }
      }
    });


  }

  handleRequestOpen(evt) {
    evt.preventDefault();
    const {user} = this.props;
    if(this.state.messageIds.length > 0 || user.userProfile) {
        this.setState({open: true});
    }
  }

  handleRequestClose = () => {
    this.setState({open: false});
  };

  renderMessages() {
    const { classes } = this.props;
    return (
      <React.Fragment>
      <p>{constant.recentUpdate}</p>
      <div className={classes.container}>
        <FilterBar disableLocationDrawer={true} filterID={constant.recentEventLabel}/>
        <MessageList
          eventNumber={100}
          distance={10}
          messageIds={this.state.messageIds}
          id={constant.recentEventLabel}
        />
      </div>
      </React.Fragment>
    );
  }

  renderMission() {
    const { user, addressBook } = this.props;
    if(user.userProfile) {
      return (
        <React.Fragment>
          <p>{constant.recentMission}</p>
          <MissionView user={user.user} userProfile={user.userProfile} addressList={addressBook.addresses} bookmarkList={user.bookmarkList}/>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }



  render() {
    const {user} = this.props;
    const {queryMessage, bookmark} = this.state;
    let messageHtml = null;
    let missionHtml = null;
    let recentMessage = null;
    let userCount = 0;
    if(user.userProfile) {
      userCount = 1;
    }
    let output = null;
    let badgeCount = this.state.messageIds.length + userCount;
    if(queryMessage || bookmark) {
      badgeCount++;
    }

    missionHtml = this.renderMission();
    if(this.state.messageIds.length > 0) {
      if (this.state.messageIds.length !== this.state.messageIdsLength) {
        this.setState({
          messageIdsLength: this.state.messageIds.length
        });

        messageHtml = null;
      } else {
        messageHtml = this.renderMessages();
      }
    }


    if (queryMessage) {
      let message = queryMessage;
      recentMessage = <React.Fragment>
                        <p>{constant.recentEventLabel}</p>
                        <MessageView message={message} key={message.key}  />
                      </React.Fragment>;
      badgeCount++;
    } else if (bookmark) {
      recentMessage = <React.Fragment>
                        <p>{constant.recentEventLabel}</p>
                        <BookmarkView bookmark={bookmark}  />
                      </React.Fragment>;
      badgeCount++;
    }

    if(badgeCount > 0) {
      output = <React.Fragment>
            {recentMessage}
            {missionHtml}
            {messageHtml}
        </React.Fragment>;
    }
    return(output);
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    addressBook: state.addressBook,
    recentMessage : state.recentMessage,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleAddressDialog: flag => dispatch(toggleAddressDialog(flag)),
  }
};

NotificationsDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NotificationsDialog));
