import * as firebase from 'firebase';
import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Card, { CardActions, CardContent, CardMedia} from 'material-ui/Card';
import ProgressiveCardImg from './ProgressiveCardImg';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ForumIcon from 'material-ui-icons/Forum';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import red from 'material-ui/colors/red';
import EventMap from './REventMap';
import ChipArray from './ChipArray';
import MessageDetailViewImage from './MessageDetailViewImage';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import CommentList from './comment/CommentList';
import geoString from './GeoLocationString';
import PostCommentView from './comment/PostCommentView';
import Avatar from 'material-ui/Avatar';
import green from 'material-ui/colors/green';
import {
  updateRecentMessage,
  updatePublicProfileDialog,
} from './actions';
import {connect} from 'react-redux';

const styles = theme => ({
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


  renderAuthor() {
    const { message, classes} = this.props;
    const photoUrl = message.photoUrl || '/images/profile_placeholder.png';
    let fbProfileImage = <Avatar src={photoUrl} onClick={() => this.handleAuthorClick()} />;
    return (
      <div className={classes.authorContainer}>
        <div className={classes.authorColumn}>
          {fbProfileImage}
        </div>
        <div className={classes.authorColumn2}>
          &nbsp; {message.name}
        </div>
        <div className={classes.authorColumn2}>
           現況: {message.status}
        </div>
      </div>
    );
  }

  renderLocation() {
    var locationString = null
    const { message, classes } = this.props;
    if (message.streetAddress) {
      locationString = `地點: ${message.streetAddress} (${geoString(message.geolocation.latitude, message.geolocation.longitude)})`;
    } else {
      locationString = `地點: 近(${geoString(message.geolocation.latitude, message.geolocation.longitude)})`;
    }
    return (
      <CardContent>
        <Typography component='p'>
        {locationString}
        </Typography>
      </CardContent>
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
      linkHtml = <Grid container spacing={0}>
        <Grid item>
        <CardContent> <Typography component='p'> 外部連結： <a href={link} target="_blank">前往</a> </Typography> </CardContent></Grid></Grid>;
    } else {
      if(link != null && link != "")
      linkHtml = <Grid container spacing={0}>
        <Grid item>
        <CardContent> <Typography component='p'> {link} </Typography> </CardContent></Grid></Grid>;
      
    }
    const author = this.renderAuthor();
    let baseHtml = <Grid container spacing={0}> {this.renderLocation()}</Grid>;

    let dateHtml = null;
    if(dateTimeString != null) { 
        dateHtml = <Grid container spacing={0}>
                        <Grid item><CardContent><Typography component='p'> 開始: {dateTimeString}</Typography> </CardContent> </Grid>  
                        <Grid item><CardContent><Typography component='p'> 為期: {duration} </Typography> </CardContent> </Grid>
                        <Grid item><CardContent><Typography component='p'> 週期: {interval} </Typography> </CardContent> </Grid>                
                        </Grid>;
    }

    const tab = this.state.tab;

    return(<div className={classes.container}>
             {author}
             <ChipArray chipData={chips} />
             {baseHtml}
             {linkHtml}
             {dateHtml}
             <br/>
             <br/>
             <br/>
             <div>
               <AppBar position="static" className={classes.appBar}>
                 <Tabs value={tab} onChange={this.handleChangeTab} fullWidth>
                   <Tab label="參與紀錄" />
                   <Tab label="圖片" />
                   <Tab label="地圖"/>
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
