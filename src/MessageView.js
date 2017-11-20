import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card, { CardHeader} from 'material-ui/Card';
import getLocation from './Location';
import distance from './Distance';
import timeOffsetStringInChinese from './TimeString.js';
import { withStyles } from 'material-ui/styles';
import red from 'material-ui/colors/red';
import MessageDialog from './MessageDialog';


const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  avatar: {
    backgroundColor: red[500],
  },
  flexGrow: {
    flex: '1 1 auto',
  },
});

class MessageView extends Component {
  constructor(props) {
    super(props);
    this.state = {lat: 0, lon: 0, dialogOpen: false};
    this.successCallBack = this.successCallBack.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    getLocation(this.successCallBack, this.errorCallBack, this.notSupportedCallback);
  }

  notSupportedCallBack() {
    console.log('Disabled');
  }

  successCallBack(pos) {
    this.setState({ lat: pos.coords.latitude, lon: pos.coords.longitude}); 
  }

  errorCallBack(error) {
    console.warn('ERROR(${err.code}): ${err.message}');
  }

  openDialog() {
    this.messageDialog.openDialog();
  }

  handleClick() {
    this.openDialog();
  };


  render() {
    const classes = this.props.classes;
    var m = this.props.message;
    var uuid = this.props.message.key;
    var user = this.props.user;
    var distanceSpan = "距離: ";
    if (m.latitude) {
      if (this.state.lat) {
        var dis = distance(m.longitude,m.latitude,this.state.lon,this.state.lat);
        var dist;
        if (dis > 1)
          dist = Math.round(dis) + "km";
        else
          dist = Math.round(dis * 1000) + "m";
        distanceSpan += dist;
      }
    }
    var timeOffset = Date.now() - m.createdAt;
    var timeOffsetString = timeOffsetStringInChinese(timeOffset);
    var subtitle = '張貼於： ' + timeOffsetString + '前 ' + distanceSpan;
    return (<div>
              <Card>                   
                <CardHeader
                  title={m.text}
                  subheader={subtitle}
                  onClick={() => this.handleClick()}>
                </CardHeader>
                <MessageDialog message={m} uuid={uuid} user={user} ref={(messageDialog) => {this.messageDialog = messageDialog;}} openDialog={openDialog => this.openDialog = openDialog}/>
              </Card>
              <br/>
            </div>);
  }
}

MessageView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MessageView);
//export default MessageView;