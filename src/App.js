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
import DocumentMeta from 'react-document-meta';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);  
const store = createStoreWithMiddleware(rootReducer);

class App extends Component {
  constructor(props) {
    super(props);
    let params = (new URL(document.location)).searchParams;
    this.eventId = params.get("eventid");
    console.log('App: ' + this.eventId);
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
    var desc = "Desc";
    if(this.eventId != null) {
      // Add og metadata
      // getMessage(this.props.uuid).then((message) => {this.queryMessage = message});
      desc = this.eventId;
      console.log('desc: ' + this.eventId + ' ' + desc);
    }
    var meta = {
      title: "我地",
      description: {desc},
      canonical: 'http://example.com/path/to/page',
      meta: {
        charset: 'utf-8',
        name: {
          keywords: 'react,meta,document,html,tags'
        }
      }
    };    
    return (
      <DocumentMeta {...meta}>
        <Provider store={store}>
          <div>

            <Header ref={(header) => {this.header = header;}} updateLocationCallback={this.updateLocation} />
            <Main updateLocationCallback={updateLocationCallback => this.updateLocationCallback = updateLocationCallback}/>
          </div>
        </Provider>
      </DocumentMeta>
    );
  }
}

export default App;
