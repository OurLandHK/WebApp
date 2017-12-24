import React, { Component } from 'react';
import * as firebase from 'firebase';
import config from './config/default';
import MessageView from './MessageView';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import {getMessage} from './MessageDB';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {data:[], lon:200, lat:100};
    this.setMessage = this.setMessage.bind(this);
    this.updateLocation = this.updateLocation.bind(this);
    this.props.updateLocationCallback(this.updateLocation);
  }

  updateLocation(locationString, longitude, latitude) {
    console.log('Message List: ' + longitude + "," + latitude);
    this.setState({lon: longitude, lat: latitude});
  }

  componentDidMount() {
    if(this.props.uuid != null) {
      getMessage(this.props.uuid).then((message) => {this.queryMessage = message});
    } else {
      this.queryMessage = null;
    }    
    var auth = firebase.auth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.fetchMessages(user); 
      } else {
        this.setState({data:[]})
      }
    });
  }

  setMessage(data) {
    var val = data.val();
    this.state.data.push(val);
    this.setState({data:this.state.data});
  };

  
  fetchMessages(user) {
    this.setState({user:user});    
    var database = firebase.database();  
 
     // Loads the last 20 messages and listen for new ones.
     var messageNumber = this.props.eventNumber; 
     this.messagesRef = database.ref(config.messageDB);
     // Make sure we remove all previous listeners.
     this.messagesRef.off();
   
     this.messagesRef.orderByChild("createdAt").limitToLast(messageNumber).on('child_added', this.setMessage);
     this.messagesRef.orderByChild("createdAt").limitToLast(messageNumber).on('child_changed', this.setMessage);

  }

  render() {
    let elements = null;
    let queryMessage = null;
    if(this.state.lon != 200) { // for receive the location info from upper layer
      elements = this.state.data.reverse().map((message) => {
        return (<MessageView message={message} key={message.key} user={this.state.user} lon={this.state.lon} lat={this.state.lat}/>);
      });

      if(this.queryMessage != null) {
        console.log("queryMessage2");      
        var message = this.queryMessage;
        queryMessage = <MessageView message={message} key={message.key} user={this.state.user} lon={this.state.lon} lat={this.state.lat} openDialogDefault={true} />;  
      }
    }
    return (<div width="100%"><AppBar position="static" marginTop="1"><Toolbar/></AppBar>{queryMessage}{elements}</div>);
  }
};


export default MessageList;
