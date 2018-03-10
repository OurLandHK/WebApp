import MessageList from './MessageList';
import PostMessageView from './PostMessageView';
import MessageDialog from './MessageDialog';
import PublicProfile from './PublicProfile';
import React, { Component } from 'react';
import config, {constant} from './config/default';
//import PropTypes from 'prop-types';
//import {connect} from "react-redux";

class Main extends Component {
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
        geolocation: this.props.geolocation,
        userId: this.props.userId
      };
      this.updateFilter = this.updateFilter.bind(this);
  }

  updateFilter(eventNumber, distance, geolocation) {
//    console.log("Main Update Filter : " + geolocation.latitude + "," + geolocation.longitude);
    this.setState({
      eventNumber: eventNumber,
      distance: distance, 
      geolocation: geolocation,
    });
    this.messageList.updateFilter(eventNumber, distance, geolocation);
  }

  handleClick() {
    this.openDialog();
  };

  render() {
    let pubilcProfileHtml = null;
    let messageHtml = null;
    console.log("Query UserID: " + this.state.userId + " eventID: " + this.state.eventId);
    if(this.state.userId != null && this.state.userId != "") {
      pubilcProfileHtml = <PublicProfile id={this.state.userId}/>;
    } else {
      messageHtml = <div><MessageList ref={(messageList) => {this.messageList = messageList;}} uuid={this.state.eventId} eventNumber={this.state.eventNumber} distance={this.state.distance} geolocation={this.state.geolocation}/><PostMessageView/></div>;
    }
    return (
      <div>
        <br/>
          {pubilcProfileHtml}
          {messageHtml}
      </div>
    );
  }
}

/*
const mapStateToProps = (state, ownProps) => {
  return {
    geoLocation : state.geoLocation,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(Main);
*/
export default Main;
