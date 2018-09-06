import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import EventListDialog from './EventListDialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText  from '@material-ui/core/ListItemText';
import {connect} from "react-redux";
import { togglePublicProfileDialog } from './actions';
import {fetchBookmarkList, getUserProfile} from './UserProfile';
import ShareDrawer from './ShareDrawer';
import BookmarkList from './bookmark/BookmarkList';
import {checkImageExists} from './util/http';
import {constant} from './config/default';
import {trackEvent} from './track';

function Transition(props) {
  return <Slide direction="left" {...props} />;
}


const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  container: {
   overflowY: 'auto'
  }
};

class PublicProfile extends React.Component {
  constructor(props) {
    super(props);
    if(this.props.fbId) {
      this.fbId = this.props.fbId;
    }
    this.state = {userProfile: null, bookmarkList: []};
    this.publishMessages = null;
    this.completeMessages = null;
    this.onBackButtonEvent = this.onBackButtonEvent.bind(this);
  }

  onBackButtonEvent(e) {
    e.preventDefault();
    this.handleRequestClose();
  }

  loadFbLoginApi() {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: '640276812834634',
        cookie: true,
        xfbml: true,
        version: 'v2.10'
      });
    };

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  componentDidMount() {
    //this.loadFbLoginApi();
    if (this.props.id !== "") {
      //console.log("componentDidMount id  " + this.props.id);
      let user = {uid: this.props.id};
      this.fetchUserProfile(user);
    }
    if (this.props.userid  != null ) {
      //console.log("componentDidMount id  " + this.props.id);
      let user = {uid: this.props.userid};
      this.fetchUserProfile(user);
    }
  }

  fetchUserProfile(user) {
    this.setState({userProfile: null});
    this.publishMessages = null;
    this.completeMessages = null;
    getUserProfile(user).then((userProfile)=>{
      fetchBookmarkList(user).then((bookmarkList)=>{
      this.completeMessages = userProfile.completeMessages;
      this.publishMessages = userProfile.publishMessages;
      trackEvent('PublicProfile', userProfile.displayName);
      this.setState({user: user, userProfile: userProfile, bookmarkList: bookmarkList});
      //this.fbUserProfile();
      });
    });
  }

  fbUserProfile() {
    console.log('fbUserProfile');
    window.FB.getLoginStatus(function(response) {
      console.log("Good to see you, %o,", response);
      if (response.status === 'connected') {
        let accessToken = response.authResponse.accessToken;
        accessToken = "640276812834634|pIjBcwr-KsmubfPz9f1oOhhxQ3E";
        console.log('Welcome!  Fetching your information.... ' + this.fbId);
        window.FB.api('/' + this.fbId, 'get',{access_token :accessToken,  fields: 'link'}, function(response1) {
          console.log("Good to see you, %o,", response1);
          this.setState({link: response1.link});
        });
      }
    } );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.id !== this.props.id && this.props.id !== "") {
      var user = {uid: this.props.id};
      this.fetchUserProfile(user);
    }
  }


  handleRequestClose = () => {
//    window.history.pushState("", "", `/`)
    window.onpopstate = this.lastOnPopState;
    if(this.props.closeDialog  != null ) {
      this.props.closeDialog();
    } else {
      this.props.togglePublicProfileDialog(false);
    }
  };


  render() {
    var displayName = "...";
    let imageHtml = "等一下";
//    let concernMessage = null;
    let publishMessage = null;
    let completeMessage = null;
    let desc = null;
    let facebookhtml = null;
    if(this.state.userProfile  != null ) {
      var imgURL = '/images/profile_placeholder.png';
      if(checkImageExists(this.state.userProfile.photoURL)) {
        imgURL = this.state.userProfile.photoURL;
      }
      displayName = this.state.userProfile.displayName;
      var displayNameLabel = "名字:" + displayName;
      imageHtml =  <img src={imgURL}/>;
      if(this.state.userProfile.desc  != null  && this.state.userProfile.desc !== "") {
        desc = <ListItem >
          <ListItemText primary={"簡介: " + this.state.userProfile.desc}/>
        </ListItem>
      }
      publishMessage = <EventListDialog title="發表事件: " displayName={displayName} messageIds={this.publishMessages}/>
      completeMessage = <EventListDialog title="完成事件: " displayName={displayName} messageIds={this.completeMessages}/>
      if(this.state.userProfile.fbuid) {
        this.fbId=this.state.userProfile.fbuid;
      }
    }



    if(this.state.link){
     facebookhtml =
     <ListItem button >
      <ListItemText primary="臉書連結:"/> <a href={this.state.link} target="_blank">前往</a>
    </ListItem>;
    }


    const { classes, open, id } = this.props;
    let dialogOpen = open;
    let userid = id;
    if(this.props.userid  != null ) {
      dialogOpen = true;
      userid = this.props.userid;
    }
    if(dialogOpen) {
      if(window.onpopstate !== this.onBackButtonEvent) {
        window.history.pushState("", "", `/user/${userid}`)
        this.lastOnPopState = window.onpopstate;
        window.onpopstate = this.onBackButtonEvent;
      }
    }
    return (
      <React.Fragment>
        <br/>
        <Dialog fullScreen  open={dialogOpen} onRequestClose={this.handleRequestClose} transition={Transition} unmountOnExit>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                  <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>{constant.publicProfileLabel}</Typography>
              <ShareDrawer uid={userid} displayName={displayName}/>
            </Toolbar>
          </AppBar>
          <div className={classes.container}>
            <br/>
            <br/>
            <List>
              <ListItem >
                <ListItemText primary={displayNameLabel}/> <br/> {imageHtml}
              </ListItem>
              {desc}
              {facebookhtml}
              <Divider/>
              {publishMessage}
              {completeMessage}
            </List>
            {constant.bookmarkTitleLabel}
            <BookmarkList bookmarkList={this.state.bookmarkList} />
          </div>
        </Dialog>
      </React.Fragment>);
  }
}

PublicProfile.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    open: state.publicProfileDialog.open,
    id: state.publicProfileDialog.id,
    fbId: state.publicProfileDialog.fbId
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    togglePublicProfileDialog: flag =>
      dispatch(togglePublicProfileDialog(flag)),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PublicProfile));
