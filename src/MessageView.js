import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid'
import distance from './Distance';
import timeOffsetStringInChinese from './TimeString.js';
import { withStyles } from '@material-ui/core/styles';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import Paper from '@material-ui/core/Paper';
import red from '@material-ui/core/colors/red';
import MessageDialog from './MessageDialog';
import Typography from '@material-ui/core/Typography';
import {incMessageViewCount} from './MessageDB';
import {
  updateRecentMessage,
} from './actions';
import {connect} from "react-redux";
import green from '@material-ui/core/colors/green';


const styles = theme => ({
  tileCard: {
    height:200,
    width:196,
  },
  tileMedia: {
    height: 128,
    //paddingTop: '56.25%', // 16:9
  },
  paper: {
    width: '98%',
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
/*  
  sliceRender(text, auther, imageUrl, subtitle, isUpdate) {
    const classes = this.props.classes;
    let newIcon = null;
    if(isUpdate) {
      newIcon = <FiberNewIcon className={classes.newIcon}/>
    }
    let summary = <div className={classes.details}>
                    <CardContent className={classes.content}>
                      <Typography className={classes.title}>{newIcon}{auther}</Typography>
                      <Typography noWrap='true' variant="headline"> {text}</Typography>
                      <Typography className={classes.pos}>{subtitle}</Typography>
                    </CardContent>
                  </div>
    let thumbnail = <CardMedia className={classes.cover}  image={imageUrl}/>;
    return (<Card container className={classes.card}  onClick={() => this.handleClick()}>
              {thumbnail}
              {summary}
            </Card>);
  }
*/  

  sliceRender(text, auther, imageUrl, subtitle, isUpdate) {
    const classes = this.props.classes;
    let newIcon = null;
    if(isUpdate) {
      newIcon = <FiberNewIcon className={classes.newIcon}/>
    }    
    let summary = <Grid item xs onClick={() => this.handleClick()}>
                      <Typography noWrap='true'className={classes.title}>{newIcon}{auther}</Typography>
                      <Typography noWrap='true' variant="title"> {text}</Typography>
                      <Typography noWrap='true' className={classes.pos}>{subtitle}</Typography>
                  </Grid>
    let thumbnail = <Grid item><CardMedia className={classes.cover}  image={imageUrl}/> </Grid>
    return ( <Paper className={classes.paper}>
              <Grid container wrap="nowrap" spacing={16}>
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
    timeOffset = Date.now() - createdAt;
    let timeOffsetString = timeOffsetStringInChinese(timeOffset);
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
    var auther = m.name + ' 於: ' + timeOffsetString + '前張貼 ';
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
      card = this.sliceRender(m.text, auther, imageUrl, subtitle, isUpdate);
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

