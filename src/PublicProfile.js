import React, { Component } from 'react';
import * as firebase from 'firebase';
import config from './config/default';

class PublicProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {data:[]}
  }

  render() {
    let concernMessages = null;
    if (this.state.data.concernMessages) {
      concernMessages = this.state.data.concernMessages.map((val) => (<div>{val}</div>));
    }

    let publishMessages = null;
    if (this.state.data.publishMessages) {
      publishMessages = this.state.data.publishMessages.map((val) => (<div>{val}</div>));
    }

    return (
      <div>
        <br/>
        <h2>簡介</h2>
        名字: {this.state.data.displayName} <br/>
        <img src={this.state.data.photoURL}/>
        關注問題: <br/>
        {concernMessages}
        發佈問題: <br/>
        {publishMessages}
      </div>);
  }

  fetchUserProfile() {
     var database = firebase.database();  
     this.userRef = database.ref(config.userDB);
  // Make sure we remove all previous listeners.
     this.userRef.off();
     // Loads the last 12 messages and listen for new ones.
     var setUser = (data) => {
       var val = data.val();
       this.setState({data:val});
     };
     this.userRef.child(this.props.match.params.id).once('value').then(setUser);
  }

  componentDidMount() {
    var auth = firebase.auth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.fetchUserProfile()
      } else {
        this.setState({data:[]})
      }
    });
  }
 
}

export default PublicProfile;
