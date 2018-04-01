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
import {getMessage} from './MessageDB';
import { createStore, applyMiddleware } from 'redux';  
import thunk from 'redux-thunk';  
import {connect} from "react-redux";
import rootReducer from './reducers';
import {
  fetchAddressBookByUser,
  fetchAddressBookFromOurLand,
  updateFilterDefault,
  checkAuthState
} from './actions';
import {constant} from './config/default';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);  
const store = createStoreWithMiddleware(rootReducer);

class App extends Component {
  constructor(props) {
    super(props);
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
      };
  }  

  componentWillMount() {
    this.props.checkAuthState();
    this.props.fetchAddressBookFromOurLand();
    this.props.updateFilterDefault(this.state.eventNumber, this.state.distance, null);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user != this.props.user && this.props.user.user) {
      this.props.fetchAddressBookByUser(this.props.user.user);    
    }
  }

  render() {
    /* Needed for onTouchTap
       http://stackoverflow.com/a/34015469/988941
    */
    //injectTapEventPlugin();   
    return (
        <div>
          <Header />
          <Main
            eventId={this.state.eventId}
            userId={this.state.userId}
            eventNumber={this.state.eventNumber}
            distance={this.state.distance}
          />
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
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(App);
