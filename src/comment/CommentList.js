import React, { Component } from 'react';
import * as firebase from 'firebase';
import config from '../config/default';
import CommentView from './CommentView';
//import {postComment, fetchCommentsBaseonMessageID} from '../MessageDB';
import {connect} from "react-redux";


class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {data:[]};
    this.setComment = this.setComment.bind(this);
  }

  componentDidMount() {
    var auth = firebase.auth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.fetchComments(user); 
      } else {
        this.setState({data:[]})
      }
    });
  }

  setComment(doc) {
//    var val = doc.data();
    var val = doc.data;
    this.state.data.push(val);
    this.setState({data:this.state.data});
  };

  
  fetchComments(user) {
    this.setState({user:user});
    if(this.props.messageUUID != null) {
//        fetchCommentsBaseonMessageID(user, this.props.messageUUID, this.setComment)
        var now = Date.now();
        var messageRecord1 = {
            data: {
                hide: false,
                name: user.displayName,
                photoUrl: user.providerData[0].photoURL || '/images/profile_placeholder.png',
                text: "Testing 1 ",
                geolocation: new firebase.firestore.GeoPoint(0, 0),
                streetAddress: null,
                changeStatus:  null,
                createdAt: new Date(now),
                uid: user.uid,
                fbuid: user.providerData[0].uid,
                link: null,
            }
        };
        var messageRecord2 = {
            data: {
                hide: false,
                name: user.displayName,
                photoUrl: user.providerData[0].photoURL || '/images/profile_placeholder.png',
                text: null,
                geolocation: new firebase.firestore.GeoPoint(22, 114),
                streetAddress: null,
                changeStatus:  null,
                createdAt: new Date(now),
                uid: user.uid,
                fbuid: user.providerData[0].uid,
                link: null,
            }
        };        
        var messageRecord3 = {
            data: {
                hide: false,
                name: user.displayName,
                photoUrl: user.providerData[0].photoURL || '/images/profile_placeholder.png',
                text: null,
                geolocation: null,
                streetAddress: null,
                changeStatus:  "Closed",
                createdAt: new Date(now),
                uid: user.uid,
                fbuid: user.providerData[0].uid,
                link: null,
            }
        };      
        var messageRecord4 = {
            data: {
                hide: false,
                name: user.displayName,
                photoUrl: user.providerData[0].photoURL || '/images/profile_placeholder.png',
                text: null,
                geolocation: null,
                streetAddress: null,
                changeStatus:  null,
                createdAt: new Date(now),
                uid: user.uid,
                fbuid: user.providerData[0].uid,
                link: "www.facebook.com",
            }
        };              
        this.setComment(messageRecord1);
        this.setComment(messageRecord2);
        this.setComment(messageRecord3);
        this.setComment(messageRecord4);
    }
  }

  render() {
    let elements = null;
    elements = this.state.data.reverse().map((comment) => {
        return (<CommentView comment={comment}/>);
      });      
    return (<div width="100%">{elements}</div>);
  }
};

export default CommentList;
