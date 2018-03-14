import React, { Component } from 'react';
import * as firebase from 'firebase';
import config, {constant} from './config/default';
import MessageView from './MessageView';
import {getMessage, fetchMessagesBaseOnGeo} from './MessageDB';
import { updateFilter } from './actions';
import {connect} from "react-redux";


class MessageList extends Component {
  constructor(props) {
    super(props);
    let geolocation = this.props.geolocation;
    if(geolocation == null) {
      geolocation = constant.invalidLocation;
    }
    this.state = {
      eventId: this.props.eventId,
      eventNumber: this.props.eventNumber,
      distance: this.props.distance, 
      geolocation: geolocation,
      userId: this.props.userId,
      data:[]
    };
    this.updateFilter = this.updateFilter.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.clear = this.clear.bind(this);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.filter !== this.props.filter) {
      this.refreshMessageList(nextProps.filter);
    }
  }

  componentDidMount() {
    this.refreshMessageList();
  }

  updateFilter(eventNumber, distance, geolocation) {
    console.log("ML Update Filter: " + geolocation);
    const { updateFilter } = this.props;
    updateFilter(eventNumber, distance, geolocation);
    this.refreshMessageList();
  }

  refreshMessageList(filter) {
    if(this.props.uuid != null && this.props.uuid != "") {
      getMessage(this.props.uuid).then((message) => {this.queryMessage = message});
    } else {
      this.queryMessage = null;
    }    
    var auth = firebase.auth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.fetchMessages(user, filter); 
      } else {
        this.clear();
      }
    });
  }

  setMessage(doc) {
    var val = doc.data();
    this.state.data.push(val);
    this.setState({data:this.state.data});
  };

  clear() {
    this.setState({data: []});
  }  


  fetchMessages(user, filter) {
    this.setState({user:user});     
    const {
     eventNumber: numberOfMessage,
     distance,
     geolocation
    } = filter;
    if(geolocation != constant.invalidLocation) {
      console.log("FetchMessage: " + geolocation);
      this.clear();
      fetchMessagesBaseOnGeo(geolocation, distance, numberOfMessage, this.setMessage);
    }
  }

  render() {
    let elements = null;
    let queryMessage = null;
    let linebreak = <div><br/><br/><br/><br/></div>;
    let lon = 0; 
    let lat = 0;
    
    if(this.state.geolocation != constant.invalidLocation) {
      lon = this.state.geolocation.longitude;
      lat = this.state.geolocation.latitude;
    }
    
    elements = this.state.data.map((message) => {
      return (<MessageView message={message} key={message.key} user={this.state.user} lon={lon} lat={lat}/>);
    });

    if(this.queryMessage != null) {      
      var message = this.queryMessage;
      queryMessage = <MessageView message={message} key={message.key} user={this.state.user} lon={lon} lat={lat} openDialogDefault={true} />;  
    }
    return (<div width="100%">{linebreak}{queryMessage}{elements}</div>);
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    filter : state.filter,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateFilter:
      (eventNumber, distance, geolocation) =>
        dispatch(updateFilter(eventNumber, distance, geolocation)),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
