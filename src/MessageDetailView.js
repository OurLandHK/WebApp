import * as firebase from 'firebase';
import React, { Component } from 'react';
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
import FavoriteIcon from 'material-ui-icons/Favorite';
import ShareIcon from 'material-ui-icons/Share';
import EventMap from './REventMap';
import ChipArray from './ChipArray';
import MessageDetailViewImage from './MessageDetailViewImage';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import CommentList from './comment/CommentList';
import geoString from './GeoLocationString';
import PostCommentView from './comment/PostCommentView';
import MessageExpandView from './MessageExpandView';

const styles = theme => ({
  appBar: {
    backgroundColor: theme.palette.secondary['200'],
  },
  card: {
    maxWidth: 400,
  },
  media: {
    height: 960,
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  cover: {
    width: 64,
    height: 64,
  },
  flexGrow: {
    flex: '1 1 auto',
  },
});


class MessageDetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {expanded: false, rotate: 'rotate(0deg)', tab: 0};
    this.handleChangeTab = this.handleChangeTab.bind(this);
  }

  handleExpandClick() {
    this.setState({ expanded: !this.state.expanded });

  };

  handleChangeTab(evt, value) {
     this.setState({...this.state, tab: value});
  }


  render() {
    const classes = this.props.classes;
    var m = this.props.message;
    var tag = m.tag;
    var chips = [];
    var date = null;
    var dateTimeString = null;
    if(m.start != null && m.start.getFullYear() > 1970)
    {
      date = new Date(m.start);
      dateTimeString = date.toLocaleString('zh-Hans-HK', { timeZone: 'Asia/Hong_Kong' });
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
    var facebookURL = "https://facebook.com/" + m.fbpost;
    console.log('facebookURL: '+facebookURL);
    var zoom=15;
    var photoUrl = '/images/profile_placeholder.png';
    var geolocation = {lat: m.geolocation.latitude, lng: m.geolocation.longitude};
    if (m.photoUrl) {
      photoUrl = m.photoUrl;
    }
    var locationString = null
    if(m.streetAddress != null) {
      locationString = "地點: " + m.streetAddress + " (" + geoString(m.geolocation.latitude, m.geolocation.longitude) + ")";
    } else {
      locationString = "地點: 近" + geoString(m.geolocation.latitude, m.geolocation.longitude);      
    } 
//    let locationHtml = <Grid item> <CardContent> <Typography component='p'> {locationString} </Typography> </CardContent> </Grid>;
    let locationHtml = <CardContent> <Typography component='p'> {locationString} </Typography> </CardContent>;

    let linkHtml = null;
    if (link != null && link != "") {
        console.log(link);
       // linkHtml = <Grid item> <CardContent> <Typography component='p'> 外部連結： {link} </Typography> </CardContent> </Grid>;
        linkHtml = <CardContent> <Typography component='p'> 外部連結： {link} </Typography> </CardContent>;

      }
    let fbProfileImage = <img src={photoUrl} />;
    let fbProfileLink = null;
    if (m.uid) {
      let fbProfileLink = '/?userid=' + m.uid;
      fbProfileImage = <a href={fbProfileLink}>{fbProfileImage}</a>;
    }
//    let author =  <a href={fbProfileLink}><CardMedia className={classes.cover} image={photoUrl} title={m.name}/></a>    
let author = <div>
              {fbProfileImage} 
              <CardMedia overlay={m.name}> 
                <Typography component='p'> {m.name} </Typography>
              </CardMedia>
              </div>;

    let baseHtml = <Grid container> {locationHtml}{linkHtml}</Grid>;
//    let baseHtml = <div> {locationHtml}{linkHtml}</div>;

    let actionView = <MessageExpandView message={m} uuid={m.key} user={this.props.user}/>;
    let dateHtml = null;
    if(dateTimeString != null) { 
        dateHtml = <Grid container>
                        <Grid item><CardContent><Typography component='p'> 開始: {dateTimeString}</Typography> </CardContent> </Grid>  
                        <Grid item><CardContent><Typography component='p'> 為期: {duration} </Typography> </CardContent> </Grid>
                        <Grid item><CardContent><Typography component='p'> 週期: {interval} </Typography> </CardContent> </Grid>                
                        </Grid>;
    }

    const tab = this.state.tab;
    
    let header = <Grid container>
                    <Grid item>{author}</Grid>
                    <Grid item> "現況": {m.status} <ChipArray chipData={chips} /></Grid>
                </Grid>

//let header = <div>{author} <CardContent><Typography component='p'> "現況": {m.status} </Typography><ChipArray chipData={chips} /></CardContent></div>;

    return(<div>
             {header}
             {baseHtml}
             {dateHtml}
             {actionView}
             <div>
               <AppBar position="static" className={classes.appBar}>
                 <Tabs value={tab} onChange={this.handleChangeTab} fullWidth>
                   <Tab label="參與紀錄" />
                   <Tab label="圖片" />
                   <Tab label="地圖"/>
                 </Tabs>
               </AppBar>
             </div>
             {tab == 0 && <div><PostCommentView messageUUID={m.key}/><CommentList messageUUID={m.key}/></div>}
             {tab == 1 && <MessageDetailViewImage url={m.publicImageURL}/>}
             {tab == 2 && <EventMap center={geolocation} zoom={zoom}/>}

         </div>);

    }
}

export default withStyles(styles) (MessageDetailView);
//export default MessageDetailView;
