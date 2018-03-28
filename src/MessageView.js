import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card, { CardMedia, CardHeader, CardContent} from 'material-ui/Card';
import distance from './Distance';
import timeOffsetStringInChinese from './TimeString.js';
import { withStyles } from 'material-ui/styles';
import red from 'material-ui/colors/red';
import MessageDialog from './MessageDialog';
import Typography from 'material-ui/Typography';
import {
  updateRecentMessage,
} from './actions';
import {connect} from "react-redux";

const styles = theme => ({
  card: {
    display: 'flex',
},  
  avatar: {
    backgroundColor: red[500],
  },
  flexGrow: {
    flex: '1 1 auto',
  },
  title: {
//    marginBottom: 16,
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  pos: {
//    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
},  
  cover: {
    width: 64,
    height: 64,
  },  
});

class MessageView extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { updateRecentMessage } = this.props;
    if(this.props.message.key != null && this.props.message.key != "") {
      updateRecentMessage(this.props.message.key, false);
    }
    this.openDialog();
  };


  render() {
    const classes = this.props.classes;
    var m = this.props.message;
    var uuid = this.props.message.key;
    var user = this.props.user;
    var imageUrl = m.thumbnailPublicImageURL;
    if(imageUrl == null) {
      imageUrl = m.photoUrl;
    }
    var o = false;
    if(this.props.openDialogDefault) {
      o = true;
    }

    var distanceSpan = "距離: ";
    if (m.geolocation.latitude) {
      if (this.props.lat) {
        var dis = distance(m.geolocation.longitude,m.geolocation.latitude,this.props.lon,this.props.lat);
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
    var auther = m.name + ' 於: ' + timeOffsetString + '前張貼 '
    var tag = '';
    if(m.tag != null && m.tag.length > 1) {
      tag = ' #' + m.tag[0];
    }
    var subtitle = distanceSpan + ' 現況: ' + m.status + tag;
//    let summary = <CardHeader title={m.text}  subheader={subtitle}  onClick={() => this.handleClick()}>  </CardHeader>
    let summary = <div className={classes.details}>
                    <CardContent className={classes.content} onClick={() => this.handleClick()}>
                      <Typography className={classes.title}>{auther}</Typography>
                        <Typography variant="headline" component="h2"> {m.text}</Typography>
                      <Typography className={classes.pos}>{subtitle}</Typography>
                    </CardContent>
                  </div> 
    let thumbnail = <CardMedia
                      className={classes.cover}
                      image={imageUrl}/>
    return (<div>
              <Card className={classes.card}>
                {thumbnail}
                {summary}
              </Card>
              <MessageDialog uuid={uuid} user={user} open={o} openDialog={openDialog => this.openDialog = openDialog} ref={(messageDialog) => {this.messageDialog = messageDialog;}} />
            </div>);
  }
}

MessageView.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    geoLocation : state.geoLocation,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateRecentMessage:
      (recentMessageID, open) =>
        dispatch(updateRecentMessage(recentMessageID, open)),
  }
};


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MessageView));

