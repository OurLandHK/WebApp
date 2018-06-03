import * as firebase from 'firebase';
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import ProgressiveCardImg from './ProgressiveCardImg';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied'; 
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied'; 
import ForumIcon from '@material-ui/icons/Forum';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import red from '@material-ui/core/colors/red';
import EventMap from './REventMap';
import ChipArray from './ChipArray';
import MessageDetailViewImage from './MessageDetailViewImage';
import Tab  from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import AppBar from '@material-ui/core/AppBar';
import CommentList from './comment/CommentList';
import geoString from './GeoLocationString';
import PostCommentView from './comment/PostCommentView';
import timeOffsetStringInChinese from './TimeString.js';
import Avatar from '@material-ui/core/Avatar';
import green from '@material-ui/core/colors/green';
import {
  updateRecentMessage,
  updatePublicProfileDialog,
} from './actions';
import {connect} from 'react-redux';
import { constant } from './config/default';

const styles = theme => ({
  paper: {

  },
  authorContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  authorColumn: {
    flex: '0 0 auto',
  },
  authorColumn2: {
    flex: '1 0 auto',
  },
  summaryGrid: {
    display: 'inline-grid',
    padding: '8px',
  },
  authorGrid: {
    alignItems: 'center',
    alignContent: 'center',
    
    padding: '8px'
  },
  appBar: {
    backgroundColor: theme.palette.secondary['200'],
  },
  avatar: {
    backgroundColor: red[500],
  },
  cover: {
    width: 64,
    height: 64,
  },
  container: {
    overflowY: 'auto'
  }
});


class MessageDetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {expanded: false, rotate: 'rotate(0deg)', tab: 0};
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.handleAuthorClick = this.handleAuthorClick.bind(this);
  }

  handleExpandClick() {
    this.setState({ expanded: !this.state.expanded });

  };

  handleChangeTab(evt, value) {
     this.setState({...this.state, tab: value});
  }

  handleAuthorClick() {
    const {message, updatePublicProfileDialog} = this.props;
    if (message.uid && message.fbuid) {
      updatePublicProfileDialog(message.uid, message.fbuid, true)
    }
  };


  renderTitle() {
    const { message, classes} = this.props;
    let post = '張貼';
    let timeOffset = Date.now() - message.createdAt.toDate();
    let timeOffsetString = timeOffsetStringInChinese(timeOffset);
    let subheader = `於:${timeOffsetString}前${post}`;
    const photoUrl = message.photoUrl || '/images/profile_placeholder.png';
    let fbProfileImage = <Avatar src={photoUrl} onClick={() => this.handleAuthorClick()} />;
    return (
      <Grid container spacing={16}>
        <Grid item className={classes.authorGrid}>
          {fbProfileImage}
          <Typography color='primary' noWrap='true' >{message.name}</Typography>
          <Typography color='primary' noWrap='true' >{subheader}</Typography>                
        </Grid>
        <Grid item xs className={classes.summaryGrid}>
          <Typography variant="headline">{message.text}</Typography>         
        </Grid>
      </Grid>    );
  }

  renderBase() {
    let locationString = null;
    let viewCountString = constant.viewCountLabel;
    const { message, classes } = this.props;
    if (message.streetAddress) {
      locationString = `地點: ${message.streetAddress}`; // (${geoString(message.geolocation.latitude, message.geolocation.longitude)})`;
    } else {
      locationString = `地點: 近(${geoString(message.geolocation.latitude, message.geolocation.longitude)})`;
    }
    if(message.viewCount != null) {
      viewCountString += message.viewCount;
    } else {
      viewCountString += 0;
    }
    return (
      <Grid container direction='row' spacing={16}>
        <Grid item xs direction='column'  className={classes.authorGrid}>
          <Typography variant="subheading">
          {locationString}
          </Typography>
          <Typography variant="subheading">
          {`現況: ${message.status} ${viewCountString}`}
          </Typography>                
        </Grid>
        <Grid item xs className={classes.summaryGrid}>
          <Grid item> 
            <SentimentSatisfiedIcon color='primary' />: 0
          </Grid> 
          <Grid item> 
            <SentimentDissatisfiedIcon color='secondary' />: 0
          </Grid>   
        </Grid>
      </Grid> 
    );
  }

  validateExternalLink(link){
    if(link == null || link == ""){
      return false;
    }

    var rv = link.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (rv==null? false: true);
  }

  render() {
    const classes = this.props.classes;
    var m = this.props.message;
    var tag = m.tag;
    var chips = [];
    var date = null;
    var dateTimeString = '';
    if(m.start != null)
    {
      date = m.start.toDate();
      if(date.getFullYear() > 1970) {
        dateTimeString = date.toLocaleString('zh-Hans-HK', { timeZone: 'Asia/Hong_Kong' });
      } else {
        console.log(m.start);
        date = null;
      }
    }
    var interval = m.interval;
    var duration = m.duration;
    var link = m.link;
    console.log(link);
    if(Array.isArray(tag))
    {
        for (var i = 0; i < tag.length; i++) { 
            var chip = {key:i, label:tag[i]};
            chips.push(chip);
        }
    }
//    var facebookURL = "https://facebook.com/" + m.fbpost;
//    console.log('facebookURL: '+facebookURL);
    var zoom=15;
    var photoUrl = '/images/profile_placeholder.png';
    var geolocation = {lat: m.geolocation.latitude, lng: m.geolocation.longitude};
    if (m.photoUrl) {
      photoUrl = m.photoUrl;
    }
    let linkHtml = null;
    if (this.validateExternalLink(link)) {
      linkHtml = <Typography variant="subheading"> 外部連結： <a href={link} target="_blank">前往</a> </Typography>
    } else {
      if(link != null && link != "")
      linkHtml = <Typography variant="subheading"> {link} </Typography>;
      
    }
    const title = this.renderTitle();
    let baseHtml = <Grid container spacing={0}> {this.renderBase()}</Grid>;

    let dateHtml = null;
    let intervalHtml = null;
    if(dateTimeString != '') { 
      if(interval && interval != '') {
        intervalHtml =<Typography variant="subheading"> 週期: {interval} </Typography> 
      }
      dateHtml = <Paper className={classes.paper}>
                  <CardContent>
                    <Typography variant="subheading"> 開始: {dateTimeString}</Typography>  
                    <Typography variant="subheading"> 為期: {duration} </Typography>
                    {intervalHtml}
                    </CardContent>               
                  </Paper>
    }

    const tab = this.state.tab;

    return(<div className={classes.container}>
            <Paper className={classes.paper}>
             {title}
             <CardContent> 
             {baseHtml}             
              <ChipArray chipData={chips} />
             {linkHtml}
             </CardContent> 
             </Paper>             
             {dateHtml}             
             <div>
               <AppBar position="static" className={classes.appBar}>
                 <Tabs value={tab} onChange={this.handleChangeTab} fullWidth>
                   <Tab label="參與紀錄" />
                   <Tab label="相關照片" />
                   <Tab label="準確地點"/>
                 </Tabs>
               </AppBar>
             </div>
             {tab == 0 && <div><PostCommentView messageUUID={m.key} message={m}/><CommentList messageUUID={m.key}/></div>}
             {tab == 1 && <MessageDetailViewImage url={m.publicImageURL} messageUUID={m.key}/>}
             {tab == 2 && <EventMap center={geolocation} zoom={zoom}/>}
         </div>);

    }
}

const mapStateToProps = (state, ownProps) => {
  return {
    recentMessage : state.recentMessage,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateRecentMessage:
      (recentMessageID, open) =>
        dispatch(updateRecentMessage(recentMessageID, open)),
    updatePublicProfileDialog:
      (userId, fbuid, open) =>
        dispatch(updatePublicProfileDialog(userId, fbuid, open)),
  }
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)
(withStyles(styles)((MessageDetailView)));
