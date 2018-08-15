import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import MessageDialog from './MessageDialog';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid'
import distance from './Distance';
import timeOffsetStringInChinese from './TimeString.js';
import { withStyles } from '@material-ui/core/styles';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import Paper from '@material-ui/core/Paper';
import red from '@material-ui/core/colors/red';
import Typography from '@material-ui/core/Typography';
import {incMessageViewCount} from './MessageDB';
import {
  updateRecentMessage,
} from './actions';
import {connect} from "react-redux";
import green from '@material-ui/core/colors/green';
import Chip from '@material-ui/core/Chip';

import {constant, RoleEnum} from './config/default';

const styles = theme => ({
  paper: {

  },
  tileCard: {
    height:200,
    width:196,
  },
  tileMedia: {
    height: 128,
    //paddingTop: '56.25%', // 16:9
  },
  card: {
    width: '98%',
    display: 'flex',
    justify: 'flex-start',
    alignItems: 'center'
  },
  avatar: {
    backgroundColor: red[500],
  },
  flexGrow: {
    flex: '1 1 auto',
  },
  auther: {
//    marginBottom: 16,
    fontSize: 14,
    color: theme.palette.text.secondary,
//    textOverflow: 'ellipsis',
  },
  title: {
//    textOverflow: 'ellipsis', 
  },
  pos: {
//    marginBottom: 12,
    color: theme.palette.text.secondary,
//    textOverflow: 'ellipsis'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
    wrap: 'nowrap',
    zeroMinWidth: 'true'
},
  cover: {
    width: 64,
    height: 64,
  },
  newIcon: {
    backgroundColor: green,
    color: red
  },
  summaryGrid: {
    display: 'inline-grid',
    padding: '8px',
    textOverflow: 'ellipsis',
  },
  thumbnailGrid: {
    padding: '8px'
  },
  urgentEventTag: {
    backgroundColor: '#AB003C',
    color: '#E3F2FD',
    height: '22px'
  }
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

  tileRender(text, auther, imageUrl, subtitle, isReportedUrgentEvent, isUrgentEvent) {
    const classes = this.props.classes;
    let urgentEventTag = null;

    if(isUrgentEvent) {
       urgentEventTag = <Chip
        label={constant.urgent}
        className={classes.urgentEventTag}
      />
    }

     
    return (<Card className={classes.tileCard} onClick={() => this.handleClick()}>
              <CardMedia className={classes.tileMedia} image={imageUrl} title={auther}/>
              <CardContent>
                <Typography className={classes.title} variant="title">{urgentEventTag} {text}</Typography>
                <Typography className={classes.pos} component="p">{subtitle}</Typography>
              </CardContent>
            </Card>);
  };

  sliceRender(user, text, auther, imageUrl, subtitle, isUpdate, isReportedUrgentEvent, isUrgentEvent) {
    const classes = this.props.classes;
    let newIcon = null;
    let urgentEventTag = null;
    if(isUpdate) {
      newIcon = <FiberNewIcon className={classes.newIcon}/>
    }

    if(user.userProfile.role == RoleEnum.admin || user.userProfile.role == RoleEnum.monitor) {
      if(isReportedUrgentEvent && isUrgentEvent == null){
        urgentEventTag = <Chip
          label={constant.reportedUrgent}
          className={classes.urgentEventTag}
        />
      }
    }
    if(isUrgentEvent) {
       urgentEventTag = <Chip
        label={constant.urgent}
        className={classes.urgentEventTag}
      />
    }

    let summary = <Grid className={classes.summaryGrid} item xs onClick={() => this.handleClick()}>
                      <Typography className={classes.auther}>{newIcon}{auther}</Typography>
                      <Typography className={classes.title} variant="title">{urgentEventTag} {text}</Typography>
                      <Typography className={classes.pos}>{subtitle}</Typography>
                  </Grid>
    let thumbnail = <Grid item className={classes.thumbnailGrid}><CardMedia className={classes.cover}  image={imageUrl}/> </Grid>
    return ( <Paper className={classes.paper}>
              <Grid container spacing={0}>
              {thumbnail}
              {summary}
              </Grid>
            </Paper>);

  }



  render() {
    const classes = this.props.classes;
    const user = this.props.user;
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
    let createdAt = 0;
    try {
      createdAt = m.createdAt.toDate();
    } catch(error) {
      createdAt = m.createdAt;
    };
    let isUpdate =false;
    let updateTime = m.createdAt;
    if(m.lastUpdate != null) {
      updateTime = m.lastUpdate;
    }
    if(user.lastLogin != null) {
      let lastLoginTime = user.lastLogin;
      //console.log('update Time: ' + updateTime + ' ' + lastLoginTime + ' ' + (updateTime > lastLoginTime));
      isUpdate = (updateTime > lastLoginTime);
    }
    let post = '張貼';
    timeOffset = Date.now() - m.lastUpdate.toDate();
    if(m.createdAt != m.lastUpdate) {
      post = '更新'
    }

    let timeOffsetString = timeOffsetStringInChinese(timeOffset);

    var auther = `${m.name} 於: ${timeOffsetString}前${post}`;
    var tag = '';
    if(m.tag != null && m.tag.length > 0) {
      tag = ' #' + m.tag[0];
    }
    var subtitle = distanceSpan + ' 現況：' + m.status + tag;
    let card = null;
    if(this.tile) {
      if(m.publicImageURL != null) {
        imageUrl = m.publicImageURL;
      }
      card = this.tileRender(m.text, auther, imageUrl, subtitle, m.isReportedUrgentEvent, m.isUrgentEvent);
    } else {
      card = this.sliceRender(user, m.text, auther, imageUrl, subtitle, isUpdate, m.isReportedUrgentEvent, m.isUrgentEvent);
    }
    return (
      <div className='message-item'>
          {card}
          <MessageDialog uuid={uuid} open={o} openDialog={openDialog => this.openDialog = openDialog} ref={(messageDialog) => {this.messageDialog = messageDialog;}} />
      </div>
    );
  }
}

MessageView.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    geoLocation : state.geoLocation,
    recentMessage : state.recentMessage,
    user : state.user
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
