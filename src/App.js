import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from './Main';
import PublicProfile from './PublicProfile';
import Header from './Header';
import PostMessageView from './PostMessageView';
import {getMessage} from './MessageDB';
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
  init3rdPartyLibraries
} from './actions';
import {constant} from './config/default';
import CssBaseline from '@material-ui/core/CssBaseline';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(rootReducer);

class App extends Component {
  constructor(props) {
    super(props);
    init3rdPartyLibraries();
    let params = (new URL(document.location)).searchParams;
    let eventId = params.get("eventid");
    let userId = params.get("userid");
    let eventNumber = params.get("eventnumber");
    let distance = params.get("distance");
    if(userId == null) {
      userId = "";
    }
    if(eventId == null) {
      eventId = "";
    }
    if(eventNumber == null) {
      eventNumber = constant.defaultEventNumber;
    }
    // distance in KM
    if(distance == null) {
      distance = 1;
    }
    this.state = {
        eventId: eventId,
        eventNumber: eventNumber,
        distance: distance,
        userId: userId,
        tab: 0,
      };
  }

  componentWillMount() {
    this.props.checkAuthState();
    this.props.fetchAddressBookFromOurLand();
    this.props.fetchConcernMessagesFromOurLand();
    this.props.updateFilterDefault(this.state.eventNumber, this.state.distance, null);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user != this.props.user && this.props.user.user) {
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
    let linebreak = <div><br/><br/></div>;
    const { tab } = this.state;
    const { classes, user } = this.props;
    switch(tab) {
      case 0:
        mainScreen = <Main
              eventId={this.state.eventId}
              userId={this.state.userId}
              eventNumber={this.state.eventNumber}
              distance={this.state.distance}
            />
        break;
      case 1:
        mainScreen = <BookmarkBoard/>
        break;
      case 2:
        mainScreen = <LeaderBoard/>;
        break;
      case 3:
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
              <BottomNavigationAction label={constant.homeLabel} icon={<HomeIcon />} />
              <BottomNavigationAction hidden={userLoginDisable} label={constant.concernLabel} icon={<FavoriteIcon />} />
              <BottomNavigationAction label={constant.leaderBoardLabel} icon={<RateReviewIcon />} />
              <BottomNavigationAction label={constant.userLabel} icon={<PersonIcon />} />
            </BottomNavigation>
            <PostMessageView />
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
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(App);
