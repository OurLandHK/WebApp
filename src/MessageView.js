import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBlock, CardTitle, CardSubtitle, Button } from 'reactstrap';
import * as firebase from 'firebase';
import ProgressiveCardImg from './ProgressiveCardImg';
import getLocation from './Location';
import distance from './Distance.js';

class MessageView extends Component {
  constructor(props) {
    super(props);
    this.state = {lat: 0, lon: 0};
    this.successCallBack = this.successCallBack.bind(this);
  }

  componentDidMount() {
    getLocation(this.successCallBack, this.errorCallBack, this.notSupportedCallback);
  }

  notSupportedCallBack() {
    console.log('Disabled');
  }

  successCallBack(pos) {
    console.log('Your current position is:');
    console.log('Latitude : ' + pos.coords.latitude);
    console.log('Longitude: ' + pos.coords.longitude);
    console.log('More or less ' + pos.coords.accuracy + 'meters.'); 
    this.setState({ lat: pos.coords.latitude, lon: pos.coords.longitude}); 
  }

  errorCallBack(error) {
    console.warn('ERROR(${err.code}): ${err.message}');
  }

  render() {
    var m = this.props.message;
    console.log(m);
    var locationSpan = (<span>N/A</span>);
    var distanceSpan = (<span />);
    if (m.latitude) {
      locationSpan = (<span>{m.latitude}, {m.longitude}</span>);
      if (this.state.lat) {
        var dis = distance(m.longitude,m.latitude,this.state.lon,this.state.lat);
        var dist;
        if (dis > 1)
          dist = Math.round(dis) + "km";
        else
          dist = (dis * 1000) + "m";
        locationSpan = (<span>{m.latitude}, {m.longitude}. {dist}</span>)
      }
    }
    var photoUrl = '/images/profile_placeholder.png';
    var date = new Date(m.createdAt);
    if (m.photoUrl) {
      photoUrl = m.photoUrl;
    }
    return (<div>
              <Card>
                <CardBlock>
                  <CardSubtitle>Geo: {locationSpan}<br/>Created At: {date.toGMTString()}</CardSubtitle>
                  <CardText>Summary: {m.text}</CardText>
                </CardBlock>
                <ProgressiveCardImg top gs_src={m.imageUrl}/>
                <CardBlock>
                  <CardSubtitle><img src={photoUrl}/>{m.name}</CardSubtitle>
                </CardBlock>
              </Card>
              <br/>
            </div>);
  }
}

export default MessageView;
