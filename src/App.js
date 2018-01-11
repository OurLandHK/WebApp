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

class App extends Component {
  constructor(props) {
    super(props);
    let params = (new URL(document.location)).searchParams;
    this.eventId = params.get("eventid");
    this.userId = params.get("userid");
    this.updateLocation = this.updateLocation.bind(this);
  }  

  updateLocation(locationString, longitude, latitude) {
    console.log('App: ' + longitude + "," + latitude);
    this.updateLocationCallback(locationString, longitude, latitude);
  }

  render() {
    /* Needed for onTouchTap
       http://stackoverflow.com/a/34015469/988941
    */
    injectTapEventPlugin();
    return (
      <div>
        <Header ref={(header) => {this.header = header;}} updateLocationCallback={this.updateLocation} />
        <Main updateLocationCallback={updateLocationCallback => this.updateLocationCallback = updateLocationCallback}/>
      </div>
    );
  }
}

export default App;
