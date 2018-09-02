import React, { Component } from 'react';
import * as firebase from 'firebase';
import config, {constant} from '../config/default';
import CommentView from './CommentView';
import {fetchCommentsBaseonMessageID} from '../MessageDB';
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
//    var val = doc.data;
    this.state.data.push(doc);
    this.state.data.sort((x,y) => x.data().createdAt.toDate() - y.data().createdAt.toDate());
    this.setState({data:this.state.data});
    //console.log(this.state.data)
  };

  
  fetchComments(user) {
    this.setState({user:user});
    if(this.props.messageUUID  != null ) {
        fetchCommentsBaseonMessageID(user, this.props.messageUUID, this.setComment)
    }    
  }

  render() {
    let elements = null;
    const {messageUUID} = this.props;
    elements = this.state.data.reverse().map((commentRef) => {
        return (<CommentView messageUUID={messageUUID} commentRef={commentRef}/>);
      });      
    if(this.state.data.length !=0) {
      return (<div width="100%">{elements}</div>);
    }
    return (
      <div>
        <center>
          <br/>
          <h4>{constant.emptyComment}</h4>
        </center>
      </div>
    );
  }
};

export default CommentList;
