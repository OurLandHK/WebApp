import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import Main from './Main';
import PublicProfile from './PublicProfile';
import Header from './Header';
import PostMessageView from './PostMessageView';
import { createStore, applyMiddleware } from 'redux';
import FavoriteIcon from '@material-ui/icons/Favorite';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import RateReviewIcon from '@material-ui/icons/RateReview';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import BookmarkBoard from './bookmark/BookmarkBoard';
import thunk from 'redux-thunk';
import {connect} from "react-redux";
import rootReducer from './reducers';
import Person from './Person';
import LeaderBoard from './LeaderBoard';
import {
  fetchAddressBookByUser,
  fetchAddressBookFromOurLand,
  fetchConcernMessagesFromOurLand,
  updateFilterDefault,
  checkAuthState,
  updateRecentMessage,
  updatePublicProfileDialog,
  updateRecentBookmark,
  fetchGlobalSetting,
  init3rdPartyLibraries
} from './actions';
import {constant} from './config/default';
import CssBaseline from '@material-ui/core/CssBaseline';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(rootReducer);

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
    this.props.checkAuthState();
    this.props.fetchAddressBookFromOurLand();
    this.props.fetchConcernMessagesFromOurLand();
    this.props.fetchGlobalSetting();
    this.props.updateFilterDefault(this.state.eventNumber, this.state.distance, null);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user !== this.props.user && this.props.user.user) {
      this.props.fetchAddressBookByUser(this.props.user.user);
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
    let mainScreen = null;
    let linebreak = <React.Fragment><br/><br/></React.Fragment>;
    const { tab } = this.state;
    const { classes, user } = this.props;
    switch(tab) {
      case 'main':
        mainScreen = <Main
              eventId={this.state.eventId}
              userId={this.state.userId}
              eventNumber={this.state.eventNumber}
              distance={this.state.distance}
              bookmark={this.state.bookmark}
            />
        break;
      case 'concern':
        mainScreen = <BookmarkBoard/>
        break;
      case 'leader':
        mainScreen = <LeaderBoard/>;
        break;
      case 'person':
        mainScreen = <Person/>
        break;
    }
    let userLoginDisable = true;
    if(user && user.userProfile) {
      userLoginDisable = false;
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
              <BottomNavigationAction value='concern' label={constant.concernLabel} icon={<FavoriteIcon />} />
              <PostMessageView />
              <BottomNavigationAction value='leader' label={constant.leaderBoardLabel} icon={<RateReviewIcon />} />
              <BottomNavigationAction value='person' label={constant.userLabel} icon={<PersonIcon />} />
            </BottomNavigation>
          </div>
        </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    filter : state.filter,
    geolocation: state.geolocation,
    user: state.user,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateFilterDefault:
      (eventNumber, distance, geolocation) =>
        dispatch(updateFilterDefault(eventNumber, distance, geolocation)),
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
