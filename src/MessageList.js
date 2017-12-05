import React, { Component } from 'react';
import * as firebase from 'firebase';
import config from './config/default';
import MessageView from './MessageView';
import {getMessage} from './MessageDB';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {data:[]}
    this.setMessage = this.setMessage.bind(this);
  }

  componentDidMount() {
    if(this.props.uuid != null) {
      console.log("queryMessage1");
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
    let queryMessage = null;
    if(this.queryMessage != null) {
      console.log("queryMessage2");      
      var message = this.queryMessage;
      queryMessage = <MessageView message={message} key={message.key} user={this.state.user} openDialogDefault={true} />;  
    }
    return (<div>{queryMessage}{elements}</div>);
  }
};


export default MessageList;
