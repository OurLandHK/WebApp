import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
//import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
//import classnames from 'classnames';
import red from '@material-ui/core/colors/red';
import EventMap from './REventMap';
import ChipArray from './ChipArray';
import MessageDetailViewImage from './MessageDetailViewImage';
import MessageAction from './MessageAction';
import Tab  from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import AppBar from '@material-ui/core/AppBar';
import CommentList from './comment/CommentList';
import geoString from './GeoLocationString';
import PostCommentView from './comment/PostCommentView';
import timeOffsetStringInChinese from './TimeString';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import {checkImageExists} from './util/http';
import {
  updateRecentMessage,
  updatePublicProfileDialog,
} from './actions';
import {connect} from 'react-redux';
import {constant, RoleEnum} from './config/default';
import {trackEvent} from './track';

const styles = theme => ({
  button: {
    borderRadius: 0,
    width: '64px',
    height: '64px'
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
    padding: '16px'
  },
  appBar: {
    backgroundColor: theme.palette.secondary['200'],
  },
  avatar: {
    backgroundColor: red[500],
  },
  container: {
  //  overflowY: 'auto',
    marginBottom: '40px'
  },
  actionContainer: {
    display: 'flex',
    height: '5rem',
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgentEventTag: {
    backgroundColor: '#AB003C',
    color: '#E3F2FD',
    height: '22px'
  }
});


class MessageDetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {expanded: false,
        rotate: 'rotate(0deg)',
        tab: "參與紀錄",
      };
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

  componentDidMount() {
    trackEvent('detail', this.props.message.text + '|' + this.props.message.key);
  }

  renderTitle() {
    const { user, message, classes} = this.props;
//    let post = '張貼';
    let timeOffset = Date.now() - message.createdAt.toDate();
//    let timeOffsetString = timeOffsetStringInChinese(timeOffset);
//    let subheader = `於:${timeOffsetString}前${post}`;
    let photoUrl = message.photoUrl;
    if(!checkImageExists(photoUrl)) {
      photoUrl = '/images/profile_placeholder.png';
    }
//    let fbProfileImage = <Avatar src={photoUrl} onClick={() => this.handleAuthorClick()} />;
    let urgentEventTag = null;

    if(user  != null  && user.userProfile  != null  && (user.userProfile.role === RoleEnum.admin || user.userProfile.role === RoleEnum.monitor)) {
      if(message.isReportedUrgentEvent && message.isUrgentEvent === null){
        urgentEventTag = <Chip
          label={constant.reportedUrgent}
          className={classes.urgentEventTag}
        />
      }
    }

    if(message.isUrgentEvent  != null  && message.isUrgentEvent) {
       urgentEventTag = <Chip
        label={constant.urgent}
        className={classes.urgentEventTag}
      />
    }
    return (
      <Grid container spacing={16}>
        <Grid item xs className={classes.summaryGrid}>
          <Typography variant="headline">{urgentEventTag} {message.text}</Typography>
        </Grid>
      </Grid>    );
/*
    return (
      <Grid container spacing={16}>
        <Grid item className={classes.authorGrid}>
          {fbProfileImage}
          <Typography color='primary' noWrap='true' > {message.name}</Typography>
          <Typography color='primary' noWrap='true' >{subheader}</Typography>
        </Grid>
        <Grid item xs className={classes.summaryGrid}>
          <Typography variant="headline">{urgentEventTag} {message.text}</Typography>
        </Grid>
      </Grid>    );
 */
  }



  renderBase() {
    let locationString = null;
    let viewCountString = constant.viewCountLabel;
    const { message, classes } = this.props;
    let post = '張貼';
    let timeOffset = Date.now() - message.createdAt.toDate();
    let timeOffsetString = timeOffsetStringInChinese(timeOffset);
    let subheader = `${timeOffsetString}前${post}`;
    let photoUrl = message.photoUrl;
    if(!checkImageExists(photoUrl)) {
      photoUrl = '/images/profile_placeholder.png';
    }
    let fbProfileImage = <Avatar src={photoUrl} onClick={() => this.handleAuthorClick()} />;
    if (message.streetAddress) {
      locationString = `地點: ${message.streetAddress}`; // (${geoString(message.geolocation.latitude, message.geolocation.longitude)})`;
    } else {
      locationString = `地點: 近(${geoString(message.geolocation.latitude, message.geolocation.longitude)})`;
    }
    let geolink =`geo:${message.geolocation.latitude},${message.geolocation.longitude}`;
    if /* if we're on iOS, open in Apple Maps */
    ((navigator.platform.indexOf("iPhone") !== -1) || 
     (navigator.platform.indexOf("iPad") !== -1) || 
     (navigator.platform.indexOf("iPod") !== -1)) {
      geolink = `maps://maps.google.com/maps?daddr=${message.geolocation.latitude},${message.geolocation.longitude}&amp;ll=`;
    } else {/* else use Google */
      geolink = `https://maps.google.com/maps?daddr=${message.geolocation.latitude},${message.geolocation.longitude}&amp;ll=`;
    }
    if(message.viewCount  != null ) {
      viewCountString += message.viewCount;
    } else {
      viewCountString += 0;
    }
    return (
      <Grid container spacing={16}>
        <Grid item className={classes.authorGrid}>
          {fbProfileImage}
          <Typography color='primary' noWrap='true' > {message.name}</Typography>
          <Typography color='primary' noWrap='true' >{subheader}</Typography>
        </Grid>
        <Grid item xs direction='column' className={classes.summaryGrid} >
          <a href={geolink} target="_blank">
            <Typography variant="subheading" >
            {locationString}
            </Typography>
          </a>
          <Typography variant="subheading">
          {`現況: ${message.status} ${viewCountString}`}
          </Typography>
        </Grid>
      </Grid>
    );

/*
    return (
      <Grid container direction='row' spacing={16}>
        <Grid item xs direction='column' className={classes.summaryGrid} >
          <a href={geolink}>
            <Typography variant="subheading">
            {locationString}
            </Typography>
          </a>
          <Typography variant="subheading">
          {`現況: ${message.status} ${viewCountString}`}
          </Typography>
        </Grid>
      </Grid>
    );
*/

  }

  renderTimeHtml() {
    const classes = this.props.classes;
    let rv = null;
    let m = this.props.message;
    let dateTimeString = '';
    if(m.start  != null )
    {
      let date = m.start.toDate();
      if(date.getFullYear() > 1970) {
        dateTimeString = date.toLocaleDateString('zh-Hans-HK', { timeZone: 'Asia/Hong_Kong' });
        console.log(dateTimeString);
        if(m.startTime  != null ) {
          dateTimeString += ` ${m.startTime}`;
        }
      } else {
        date = null;
      }
    }

    let everydayOpenning = m.everydayOpenning;
    let weekdaysOpennings = m.weekdaysOpennings;
    let interval = m.interval;
    let duration = m.duration;
  //  let endDate = m.endDate;
    if(dateTimeString !== '') {
      let intervalHtml = null;
      let durationHtml = null;
      let openningHtml = null;
      let timeTypeHtml = <Typography variant="subheading"> {constant.timeOptions[1]} </Typography> ;
      if(duration  != null ) {
        durationHtml = <Typography variant="subheading"> 為期: {duration} </Typography>
        timeTypeHtml = <Typography variant="subheading"> {constant.timeOptions[0]} </Typography> ;
      }
      if(interval && interval !== '' && interval !== constant.intervalOptions[0]) {
        intervalHtml =<Typography variant="subheading"> 週期: {interval} </Typography>
      }
      if(everydayOpenning) {
        openningHtml = <Typography variant="subheading"> {`${constant.openningOptions[0]} ${everydayOpenning.open}至${everydayOpenning.close}`}  </Typography>
      } else {
        if(weekdaysOpennings) {
          let i = 0;
          openningHtml = weekdaysOpennings.map((openning) => {
            let openningHours = constant.closeWholeDay;
            if(openning.enable) {
              openningHours =  `${openning.open}至${openning.close}`;
            }
            let openningHoursString = `- ${constant.weekdayLabel[i]} ${openningHours}`;
            i++;
          return <Typography variant="subheading"> {openningHoursString}  </Typography>;
          });
        }
      }
      rv = <Paper className={classes.paper}>
                  <CardContent>
                    {timeTypeHtml}
                    <Typography variant="subheading"> 開始: {dateTimeString}</Typography>
                    {durationHtml}
                    {intervalHtml}
                    {openningHtml}
                    </CardContent>
                  </Paper>
    }
    return rv;
  }

  validateExternalLink(link){
    if(link === null || link === ""){
      return false;
    }

    var rv = link.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g);
    return (rv==null? false: true);
  }

  render() {
    const classes = this.props.classes;
    const m = this.props.message;
    let tag = m.tag;
    let chips = [];
    var link = m.link;
    if(Array.isArray(tag))
    {
        for (var i = 0; i < tag.length; i++) {
            var chip = {key:i, label:tag[i]};
            chips.push(chip);
        }
    }
    var zoom=15;
    var geolocation = {lat: m.geolocation.latitude, lng: m.geolocation.longitude};
    let linkHtml = null;
    let imageHtml = null;
    if(m.publicImageURL  != null ) {
      imageHtml = <MessageDetailViewImage gallery={m.gallery} url={m.publicImageURL} messageUUID={m.key}/>
    }
    if (this.validateExternalLink(link)) {
      linkHtml = <Typography variant="subheading"> 外部連結： <a href={link} target="_blank">前往</a> </Typography>
    } else {
      if(link  != null  && link !== "")
      linkHtml = <Typography variant="subheading"> {link} </Typography>;

    }
    const title = this.renderTitle();
    let baseHtml = <Grid container spacing={0}> {this.renderBase()}</Grid>;
    let dateHtml = this.renderTimeHtml();

    const tab = this.state.tab;
    let imageTabLabel = <Tab label="相關照片" value="相關照片"/>
    imageTabLabel = null;
    return(<div className={classes.container}>
            {baseHtml}
            {imageHtml}
            <CardContent>
              {title}
              <ChipArray chipData={chips} />
              {linkHtml}
            </CardContent>
            {dateHtml}
            <MessageAction message={m} happyAndSad={this.props.happyAndSad}/>
            <AppBar position="static" className={classes.appBar}>
              <Tabs value={tab} onChange={this.handleChangeTab} fullWidth>
                <Tab label="參與紀錄" value="參與紀錄"/>
                {imageTabLabel}
                <Tab label="準確地點" value="準確地點"/>
              </Tabs>
            </AppBar>
            {tab === "參與紀錄" && <div className="wrapper"><CommentList messageUUID={m.key}/><div className="nav-wrapper"><PostCommentView messageUUID={m.key} message={m}/></div></div>}
            {tab === "相關照片" && <MessageDetailViewImage url={m.publicImageURL} messageUUID={m.key}/>}
            {tab === "準確地點" && <EventMap center={geolocation} zoom={zoom}/>}
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


export default connect( mapStateToProps,mapDispatchToProps)(withStyles(styles)((MessageDetailView)));
