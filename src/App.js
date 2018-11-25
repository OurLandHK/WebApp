import React, { Component } from 'react';
import {connect} from "react-redux";
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import RateReviewIcon from '@material-ui/icons/RateReview';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Main from './Main';
import PublicProfile from './PublicProfile';
import Header from './Header';
import PostMessageView from './PostMessageView';
import Badge from '@material-ui/core/Badge';
import Person from './Person';
import LeaderBoard from './LeaderBoard';
import SearchEventDialog from './SearchEventDialog';
import CustomizedSnackbars from './CustomizedSnackbars';
import NotificationsDialog from './NotificationsDialog';
import {updateUserFcm} from './UserProfile';
import {updateFcmDB} from './GlobalDB';

import {
  fetchAddressBookByUser,
  fetchAddressBookFromOurLand,
  fetchConcernMessagesFromOurLand,
  updateFilterDefault,
  checkMessageState,
  checkAuthState,
  updateRecentMessage,
  updatePublicProfileDialog,
  updateRecentBookmark,
  fetchGlobalSetting,
} from './actions';
import {constant} from './config/default';
import CssBaseline from '@material-ui/core/CssBaseline';

//const store = createStoreWithMiddleware(rootReducer);
/*const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#307eb9',
      main: '#006eb9',
      dark: '#004e99',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});
*/
class App extends Component {
  constructor(props) {
    super(props);
    let params = (new URL(document.location)).searchParams;
    let eventId = params.get("eventid");
    let userId = params.get("userid");
    let bookmark = params.get("bookmark");
    let eventNumber = params.get("eventnumber");
    let distance = params.get("distance");
    if(userId === null) {
      userId = "";
    }
    if(eventId === null) {
      eventId = "";
    }
    if(bookmark === null) {
      bookmark = "";
    }
    if(eventNumber === null) {
      eventNumber = constant.defaultEventNumber;
    }
    // distance in KM
    if(distance === null) {
      distance = 1;
    }
    this.state = {
        eventId: eventId,
        eventNumber: eventNumber,
        distance: distance,
        userId: userId,
        tab: 'main',
        bookmark: bookmark,
      };
      const { updateRecentMessage, updatePublicProfileDialog, updateRecentBookmark } = this.props;
      if(this.state.userId !== "" && this.state.bookmark === "") {
        updatePublicProfileDialog(this.state.userId, "", true);
      }
      if(this.state.eventId !== "") {
        updateRecentMessage(this.state.eventId, true);
      }
      if(this.state.bookmark !== "" && this.state.userId !== "") {
        updateRecentBookmark(this.state.userId, this.state.bookmark, true);
      }
  }

  componentWillMount() {
    if /* if we're on iOS, Disable Message */
    ((navigator.platform.indexOf("iPhone") !== -1) ||
     (navigator.platform.indexOf("iPad") !== -1) ||
     (navigator.platform.indexOf("iPod") !== -1)) {
    } else {/* else use Google */
      this.props.checkMessageState();
    }
    this.props.checkAuthState();
    this.props.fetchAddressBookFromOurLand();
    this.props.fetchConcernMessagesFromOurLand();
    this.props.fetchGlobalSetting();
    this.props.updateFilterDefault(this.state.eventNumber, this.state.distance, null);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user !== this.props.user) {
      if(this.props.user.user) {
        this.props.fetchAddressBookByUser(this.props.user.user);
        if(this.props.user.fcmToken && this.props.user.userProfile) {
          updateUserFcm(this.props.user.user, this.props.user.fcmToken);
          updateFcmDB(this.props.user.fcmToken, this.props.user.user.uid);
        }
      } else {
        if(this.props.user.fcmToken) {
          updateFcmDB(this.props.user.fcmToken, null);
        }
      }
    } 
  }

  handleChange = (event, value) => {
    this.setState({ tab: value });
  };

  render() {
    /* Needed for onTouchTap
       http://stackoverflow.com/a/34015469/988941
    */
    //injectTapEventPlugin();

    const { user} = this.props;
    const {id, bookmark} = this.props.recentMessage;
    let userCount = 0;
    if(user.userProfile) {
      userCount = 1;
    }
    let badgeCount = userCount;
    if(id !== "" || bookmark !== "") {
      badgeCount++;
    }

    let mainScreen = null;
    let linebreak = <React.Fragment><br/><br/></React.Fragment>;
    const { tab } = this.state;
    switch(tab) {
      case 'notification':
        mainScreen = <NotificationsDialog/>;
        break;
      case 'leader':
        mainScreen = <LeaderBoard/>;
        break;
      case 'person':
        mainScreen = <Person/>
        break;
      case 'main':
      default:
        mainScreen = <Main
              eventId={this.state.eventId}
              userId={this.state.userId}
              eventNumber={this.state.eventNumber}
              distance={this.state.distance}
              bookmark={this.state.bookmark}
            />
        break;
    }
    return (
        <div className="wrapper">
          <CssBaseline />
          <Header />
          <PublicProfile />
          {linebreak}
          {mainScreen}
          <div className="nav-placeholder" />
          <div className="nav-wrapper">
            <BottomNavigation
              value={tab}
              onChange={this.handleChange}>
              <BottomNavigationAction value='main' label={constant.homeLabel} icon={<HomeIcon />} />
              <BottomNavigationAction value='notification' label={constant.notificationLabel}
                  icon={
                  <Badge badgeContent={badgeCount} color="primary">
                    <NotificationsIcon />
                  </Badge>}
              />
              <PostMessageView />
              <BottomNavigationAction value='leader' label={constant.leaderBoardLabel} icon={<RateReviewIcon />} />
              <BottomNavigationAction value='person' label={constant.userLabel} icon={<PersonIcon />} />
            </BottomNavigation>
          </div>
          <SearchEventDialog/>
          <CustomizedSnackbars />
        </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    filter : state.filter,
    geolocation: state.geolocation,
    user: state.user,
    addressBook: state.addressBook,
    recentMessage : state.recentMessage,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateFilterDefault:
      (eventNumber, distance, geolocation) =>
        dispatch(updateFilterDefault(eventNumber, distance, geolocation)),
    checkMessageState:
      () => dispatch(checkMessageState()),
    checkAuthState:
      () => dispatch(checkAuthState()),
    fetchAddressBookByUser:
      user =>
        dispatch(fetchAddressBookByUser(user)),
    fetchAddressBookFromOurLand:
      () => dispatch(fetchAddressBookFromOurLand()),
    fetchConcernMessagesFromOurLand:
      () => dispatch(fetchConcernMessagesFromOurLand()),
    updateRecentMessage:
      (recentMessageID, open) =>
        dispatch(updateRecentMessage(recentMessageID, open)),
    updateRecentBookmark:
      (userId, bookmark, open) =>
        dispatch(updateRecentBookmark(userId, bookmark, open)),
    updatePublicProfileDialog:
      (userId, fbuid, open) =>
        dispatch(updatePublicProfileDialog(userId, fbuid, open)),
    fetchGlobalSetting:
      () => dispatch(fetchGlobalSetting())
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(App);
