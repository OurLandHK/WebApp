import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card, { CardMedia, CardHeader, CardContent} from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid'
import distance from './Distance';
import timeOffsetStringInChinese from './TimeString.js';
import { withStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import MessageDialog from './MessageDialog';
import Typography from '@material-ui/core/Typography';
import {incMessageViewCount} from './MessageDB';
import {
  updateRecentMessage,
} from './actions';
import {connect} from "react-redux";

const styles = theme => ({
  tileCard: {
    height:200,
    width:196,
  },
  tileMedia: {
    height: 128,
    //paddingTop: '56.25%', // 16:9
  },
  
  card: {
    display: 'flex',
    alignItems: 'center'
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
    this.tile = false;
    if(this.props.tile == true) {
      this.tile = true;
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { updateRecentMessage } = this.props;
    if(this.props.message.key != null && this.props.message.key != "") {
      let incViewCount = false;
      // check the message viewed in this session or not.
      if(this.props.recentMessage.recentids.indexOf(this.props.message.key) == -1) {
        incViewCount = true;
      }
      updateRecentMessage(this.props.message.key, false);
      this.openDialog();
      
      if(incViewCount) {
        incMessageViewCount(this.props.message.key);
      }
    }
  };

  tileRender(text, auther, imageUrl, subtitle) {
    const classes = this.props.classes;
    return (<Card className={classes.tileCard} onClick={() => this.handleClick()}>
              <CardMedia className={classes.tileMedia} image={imageUrl} title={auther}/>
              <CardContent>
                <Typography noWrap='true' variant="title">{text}</Typography>
                <Typography noWrap='true' component="p">{subtitle}</Typography>
              </CardContent>
            </Card>);
  };

  sliceRender(text, auther, imageUrl, subtitle) {
    const classes = this.props.classes;
    let summary = <div className={classes.details}>
                    <CardContent className={classes.content} onClick={() => this.handleClick()}>
                      <Typography className={classes.title}>{auther}</Typography>
                      <Typography noWrap='true' variant="headline"> {text}</Typography>
                      <Typography className={classes.pos}>{subtitle}</Typography>
                    </CardContent>
                  </div> 
    let thumbnail = <CardMedia className={classes.cover}  image={imageUrl}/>
    return (<Card container className={classes.card}>
              {thumbnail}
              {summary}
            </Card>);
  }

  render() {
    const classes = this.props.classes;
    var m = this.props.message;
    var uuid = this.props.message.key;
    var imageUrl = m.thumbnailPublicImageURL;
    if(imageUrl == null) {
      imageUrl = m.photoUrl;
    }
    var o = false;
    if(this.props.openDialogDefault) {
      o = true;
    }

    var distanceSpan = "";
    if (m.geolocation.latitude && (this.props.lon != 0 || this.props.lat != 0)) {
      if (this.props.lat) {
        var dis = distance(m.geolocation.longitude,m.geolocation.latitude,this.props.lon,this.props.lat);
        var dist;
        if (dis > 1)
          dist = Math.round(dis) + "km";
        else
          dist = Math.round(dis * 1000) + "m";
        distanceSpan = "距離: " + dist;
      }
    }
    let timeOffset = 0;
    try {
      timeOffset = Date.now() - m.createdAt.toDate();
    } catch(error) {
      timeOffset = Date.now() - m.createdAt;
    };
    let timeOffsetString = timeOffsetStringInChinese(timeOffset);
    var auther = m.name + ' 於: ' + timeOffsetString + '前張貼 '
    var tag = '';
    if(m.tag != null && m.tag.length > 0) {
      tag = ' #' + m.tag[0];
    }
    var subtitle = distanceSpan + ' 現況: ' + m.status + tag;
    let card = null;
    if(this.tile) {
      if(m.publicImageURL != null) {
        imageUrl = m.publicImageURL;
      }
      card = this.tileRender(m.text, auther, imageUrl, subtitle);
    } else {
      card = this.sliceRender(m.text, auther, imageUrl, subtitle);
    }
    return (<div>
              {card}
              <MessageDialog uuid={uuid} open={o} openDialog={openDialog => this.openDialog = openDialog} ref={(messageDialog) => {this.messageDialog = messageDialog;}} />
            </div>);
  }
}

MessageView.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    geoLocation : state.geoLocation,
    recentMessage : state.recentMessage,
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

