import React, { Component } from 'react';
import * as firebase from 'firebase';
import MessageView from './MessageView';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {data:[]}
  }

  componentDidMount() {
    var auth = firebase.auth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.fetchMessages(); 
      } else {
        this.setState({data:[]})
      }
    });
  }
  
  fetchMessages() {
     var database = firebase.database();  
     this.messagesRef = database.ref('messages');
  // Make sure we remove all previous listeners.
     this.messagesRef.off();

     // Loads the last 12 messages and listen for new ones.
     var setMessage = (data) => {
       var val = data.val();
       this.state.data.push(val);
       this.setState({data:this.state.data});
     };
     this.messagesRef.limitToLast(12).on('child_added', setMessage);
     this.messagesRef.limitToLast(12).on('child_changed', setMessage);

  }

  render() {
    var elements = this.state.data.map((message) => {
      return (<MessageView message={message}/>);
    });
    return (<div>{elements}</div>);
  }
};


export default MessageList;
