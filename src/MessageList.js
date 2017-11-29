import React, { Component } from 'react';
import * as firebase from 'firebase';
import config from './config/default';
import MessageView from './MessageView';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {data:[]}
    this.setMessage = this.setMessage.bind(this);
  }

  componentDidMount() {
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
     var database = firebase.database();  
     this.setState({user:user});

     // Loads the last 20 messages and listen for new ones.
     var messageNumber = 20; 
     this.messagesRef = database.ref(config.messageDB);
     // Make sure we remove all previous listeners.
     this.messagesRef.off();
   
     this.messagesRef.orderByChild("createdAt").limitToLast(messageNumber).on('child_added', this.setMessage);
     this.messagesRef.orderByChild("createdAt").limitToLast(messageNumber).on('child_changed', this.setMessage);

  }

  render() {
    var elements = this.state.data.reverse().map((message) => {
      return (<MessageView message={message} key={message.key} user={this.state.user}/>);
    });
    return (<div>{elements}</div>);
  }
};


export default MessageList;
