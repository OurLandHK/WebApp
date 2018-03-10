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
import { Provider } from 'react-redux';  
import thunk from 'redux-thunk';  
import rootReducer from './reducers';

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
      eventNumber = 20;
    }
    // distance in KM
    if(distance == null) {
      distance = 1;
    }
    this.state = {
        eventId: eventId,
        eventNumber: eventNumber,
        distance: distance, 
        geolocation: null,
        userId: userId,
      };
  }  

  changeLocation(geolocation) {
    this.setState({geolocation: geolocation});
    this.main.updateFilter(this.state.eventNumber, this.state.distance, geolocation);
  }

  render() {
    /* Needed for onTouchTap
       http://stackoverflow.com/a/34015469/988941
    */
    //injectTapEventPlugin();   
    return (
      <Provider store={store}>
        <div>
          <Header ref={(header) => {this.header = header;}}  OnChangeLocation={(geolocation) => {this.changeLocation(geolocation)}}/>
          <Main ref={(main) => {this.main = main;}} eventId={this.state.eventId} userId={this.state.userId} eventNumber={this.state.eventNumber} distance={this.state.distance} geolocation={this.state.geolocation}/>
        </div>
      </Provider>
    );
  }
}

export default App;
