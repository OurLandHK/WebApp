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
import Avatar from 'material-ui/Avatar';

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


  renderAuthor() {
    const { message, classes } = this.props;
    const photoUrl = message.photoUrl || '/images/profile_placeholder.png';
    let fbProfileImage = <Avatar src={photoUrl} />;
    let fbProfileLink = null;
    if (message.uid) {
      let fbProfileLink = '/?userid=' + message.uid;
      fbProfileImage = <a href={fbProfileLink}>{fbProfileImage}</a>;
    }
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
    
    const author = this.renderAuthor();
    let baseHtml = <Grid container> {this.renderLocation()}{linkHtml}</Grid>;

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

    return(<div>
             {author}
             <ChipArray chipData={chips} />
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
