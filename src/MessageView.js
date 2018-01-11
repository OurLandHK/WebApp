import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card, { CardHeader} from 'material-ui/Card';
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
    this.state = {lat: 0, lon: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.openDialog();
  };


  render() {
    const classes = this.props.classes;
    var m = this.props.message;
    var uuid = this.props.message.key;
    var user = this.props.user;
    //var openDialog = this.props.openDialog;
    var o = false;
    if(this.props.openDialogDefault) {
      o = true;
    }

    var distanceSpan = "距離: ";
    if (m.latitude) {
      if (this.props.lat) {
        var dis = distance(m.longitude,m.latitude,this.props.lon,this.props.lat);
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
                <MessageDialog uuid={uuid} user={user} open={o} openDialog={openDialog => this.openDialog = openDialog} ref={(messageDialog) => {this.messageDialog = messageDialog;}} />
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
