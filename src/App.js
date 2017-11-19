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
  render() {
    /* Needed for onTouchTap
       http://stackoverflow.com/a/34015469/988941
    */
    injectTapEventPlugin();
    return (
      <div>
        <Header/>
        <Router>
          <div>
            <Route exact path="/" component={Main}/>
            <Route exact path={"/profile/:id/"} component={PublicProfile}/>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
