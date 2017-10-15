/*global FB*/
import React, { Component } from 'react';
import * as firebase from 'firebase';
import config from './config/default';

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            userRecord: null,
        };
    }    

  componentDidMount() {
    console.log('UserProfile login'); 
    var auth = firebase.auth();
    console.log(auth);
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({user: user});
        // user UID as mehtod to get user data record.
        var database = firebase.database();
        var userRecord = database.ref(config.userDB +'/'+user.uid);
        console.log('userRecord: ' + userRecord);
        
        if(userRecord == null)
        {
            database.ref(config.userDB +'/'+user.uid).set({displayName: user.displayName});
        }
/*        database.ref(config.userDB +'/'+user.uid).once('value').then(
            function(snapshot) {
                this.setState({userRecord})
                var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
                // ...
            });
*/            
      }
    });
    this.loadFBLoginApi();
  }
  
  loadFBLoginApi() {
    window.fbAsyncInit = function() {
            FB.init(config.fbApp);
        };

        console.log("Loading fb api");
          // Load the SDK asynchronously
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk')); 
  }

  
  render() {
    const { classes } = this.props;
    var imgURL = '/images/profile_placeholder.png';
    var displayName = 'nobody';
    if (this.state.user) {
        imgURL = this.state.user.photoURL;
        displayName = this.state.user.displayName
    }
    return (
      <div>
      </div>
    );
  }
}
