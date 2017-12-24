import React, { Component } from 'react';
import * as firebase from 'firebase';
import config from './config/default';
import {getUserConcernMessages, getUserPublishMessages, getUserCompleteMessages, getUserProfile, updateUserLocation, getUserRecords} from './UserProfile';

class PublicProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {userProfile: null};
    this.concernMessages = null;
    this.publishMessages = null;
    this.completeMessages = null;
  }

  render() {
    var displayName = "";
    let imageHtml = null;
    if(this.state.userProfile != null) {
      displayName = this.state.userProfile.displayName;
      imageHtml =         <img src={this.state.userProfile.photoURL}/>;
    }
    return (

      <div>
        <br/>
        <h2>簡介</h2>
        名字: {displayName} <br/>
        {imageHtml}
        <br/>
        關注事件: <br/>
        {this.concernMessages} <br/>
        發佈事件: <br/>
        {this.publishMessages} <br/>
        完成事件: <br/>
        {this.completeMessages} <br/>   
      </div>);
  }

  fetchUserProfile(user) {
    getUserProfile(user).then((userProfile)=>{
      getUserConcernMessages(user).then((concernMessages)=>{
        getUserPublishMessages(user).then((publishMessages)=>{
          getUserCompleteMessages(user).then((completeMessages)=>{
            this.completeMessages = completeMessages;
            this.concernMessages = concernMessages;
            this.publishMessages = publishMessages;
            this.setState({user: user, userProfile: userProfile});
          });
        });            
      });
    });
  }

  componentDidMount() {
    var auth = firebase.auth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.fetchUserProfile(user)
      } else {
        this.setState({userProfile:null})
      }
    });
  }
 
}

export default PublicProfile;
