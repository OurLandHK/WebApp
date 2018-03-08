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
    this.state = {geolocation: null};
  }  

  changeLocation(geolocation) {
    this.setState({geolocation: geolocation});
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
          <Main geolocation={this.state.geolocation}/>
        </div>
      </Provider>
    );
  }
}

export default App;
