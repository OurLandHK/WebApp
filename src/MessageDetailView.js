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
import IconButton from '@material-ui/core/IconButton';
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
import timeOffsetStringInChinese from './TimeString';
import FavoriteButton from './FavoriteButton';
import Avatar from '@material-ui/core/Avatar';
import green from '@material-ui/core/colors/green';
import {
  updateRecentMessage,
  updatePublicProfileDialog,
} from './actions';
import {connect} from 'react-redux';
import { constant } from './config/default';

const styles = theme => ({
  button: {
    borderRadius: 0,
    width: '64px',
    height: '64px'
  },
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
  container: {
    overflowY: 'auto'
  },
  actionContainer: {
    display: 'flex',
    height: '5rem',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


class MessageDetailView extends Component {
  constructor(props) {
    super(props);
    let happyCount = 0;
    let sadCount = 0;
    let m = this.props.message;
    if(m.happyCount) {
      happyCount = m.happyCount;
    }
    if(m.sadCount) {
      sadCount = m.sadCount;
    }
    this.state = {expanded: false, 
        rotate: 'rotate(0deg)', 
        tab: 0, 
        happyAndSad: this.props.happyAndSad,
        happyCount: happyCount,
        sadCount: sadCount
      };
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.handleAuthorClick = this.handleAuthorClick.bind(this);
    this.handleHappySadClick = this.handleHappySadClick.bind(this);
  }

  handleExpandClick() {
    this.setState({ expanded: !this.state.expanded });

  };

  handleHappySadClick(happySadValue) {
    let happyCount = this.state.happyCount;
    let sadCount = this.state.sadCount;
    let happyAndSadValue = happySadValue;
    switch(this.state.happyAndSad) {
      case 0:
        if(happySadValue > 0) {
          happyCount++;
        } else {
          sadCount++;
        }
        break;
      case 1:
        happyCount--;
        if(happySadValue < 0) {
          sadCount++;
        } else {
          happyAndSadValue = 0;
        }      
        break;
      case -1:
        sadCount--;
        if(happySadValue > 0) {
          happyCount++;
        } else {
          happyAndSadValue = 0;
        }
        break;
    }
    this.setState({
      happyAndSad: happyAndSadValue,
      happyCount: happyCount,
      sadCount: sadCount
    })
  }

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

  renderAction() {
    const { classes } = this.props;
    let m = this.props.message;
    let happyCount = this.state.happyCount;
    let sadCount = this.state.sadCount;
    let happyColor = "";
    let sadColor = "";
    switch(this.state.happyAndSad) {
      case 1: 
        happyColor = "primary";
        break;
      case -1:
        sadColor = "secondary"
        break;
    }
    let disable=true;
    if(this.props.user != null && this.props.user.user != null) {
      disable = false;
    }
    return(<Paper role="button" >
        <Grid container className={classes.actionContainer} spacing={16}>
        <Grid item className={classes.authorGrid}> 
            <IconButton
                        className={classes.button}
                        disabled={disable}
                        color={happyColor}   
                        onClick={() => this.handleHappySadClick(1)}                     
                        >
              <SentimentSatisfiedIcon />
              : {happyCount}
            </IconButton>            
          </Grid> 
          <Grid item className={classes.authorGrid}> 
            <IconButton
                        className={classes.button}
                        disabled={disable}
                        color={sadColor}
                        onClick={() => this.handleHappySadClick(-1)}                        
                        >
              <SentimentDissatisfiedIcon/>
              : {sadCount}
            </IconButton>
          </Grid>  
        <Grid item >
          <FavoriteButton message={m}/>    
        </Grid>
      </Grid>
  </Paper>);
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
        <Grid item xs direction='column' className={classes.summaryGrid} >
          <Typography variant="subheading">
          {locationString}
          </Typography>
          <Typography variant="subheading">
          {`現況: ${message.status} ${viewCountString}`}
          </Typography>                
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
    let m = this.props.message;
    let tag = m.tag;
    let chips = [];
    let date = null;
    let dateTimeString = '';
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
    let actionHtml = this.renderAction();
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
             {actionHtml}             
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
    user: state.user,
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
