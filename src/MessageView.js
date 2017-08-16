import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card, { CardActions, CardContent, CardMedia , CardHeader, CardText, CardTitle} from 'material-ui/Card';
import ProgressiveCardImg from './ProgressiveCardImg';
import distance from './Distance.js';
import IconButton from 'material-ui/IconButton';
import Collapse from 'material-ui/transitions/Collapse';
import Icon from 'material-ui/Icon';
import classnames from 'classnames';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import red from 'material-ui/colors/red';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import EventMap from './REventMap';
import MessageDetailView from './MessageDetailView';


const styleSheet = createStyleSheet(theme => ({
  card: {
    maxWidth: 400,
  },
  avatar: {
    backgroundColor: red[500],
  },
  flexGrow: {
    flex: '1 1 auto',
  },
}));

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
    const classes = this.props.classes;
    var m = this.props.message;
    var distanceSpan = "距離: ";
    if (m.latitude) {
      if (this.state.lat) {
        var dis = distance(m.longitude,m.latitude,this.state.lon,this.state.lat);
        var dist;
        if (dis > 1)
          dist = Math.round(dis) + "km";
        else
          dist = (dis * 1000) + "m";
        distanceSpan += dist;
      }
    }
    var date = new Date(m.createdAt);
    var subtitle = '張貼於： ' + date.toGMTString() + ' ' + distanceSpan;
    return (<div>
              <Card >                   
                <CardHeader
                  title={m.text}
                  subheader={subtitle}                >
                </CardHeader>
                <MessageDetailView message={m} key={m.key}/>                    
              </Card>
              <br/>
            </div>);
  }
}

MessageView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(MessageView);
//export default MessageView;