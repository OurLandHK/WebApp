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
import {fetchBookmarkList, getUserProfile, getAddressBook} from './UserProfile';
import ShareDrawer from './ShareDrawer';
import BookmarkList from './bookmark/BookmarkList';
import {checkImageExists, checkFirestoreImageExists} from './util/http';
import {constant} from './config/default';
import {trackEvent} from './track';
import MissionView from './mission/MissionView';

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
  },
  userInfo: {
    marginTop: '10px',
    marginBottom: '10px',
    textAlign: 'center'
  },
  displayName: {
    marginTop: '20px',
    marginBottom: '20px',
    fontSize: '24px'
  },
  subheader: {
    padding: '15px',
    background: '#3f51b5',
    color: '#fff'
  },
  profileImage: {
    marginLeft: 'auto',
    marginRight: 'auto',
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
        getAddressBook(user).then((addressBook)=>{
          this.completeMessages = userProfile.completeMessages;
          this.publishMessages = userProfile.publishMessages;
          trackEvent('PublicProfile', userProfile.displayName);
          this.setState({user: user, userProfile: userProfile, bookmarkList: bookmarkList, addressBook: addressBook});
        });
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
    const { classes, open, id } = this.props;
    let dialogOpen = open;
    let userid = id;

    var displayName = "...";
    let imageHtml = "等一下";
    let bookmarkHtml = "";
//    let concernMessage = null;
    let publishMessage = null;
    let completeMessage = null;
    let desc = null;
    let facebookhtml = null;
    let missionHtml = null;
    if(this.state.userProfile  != null ) {
      let imgURL = '/images/profile_placeholder.png';
      if(checkFirestoreImageExists(this.state.userProfile.photoURL)) {
        imgURL = this.state.userProfile.photoURL;
      } else {
        checkImageExists(this.state.userProfile.photoURL).then( (imageUrl) => {
          if(imageUrl) {
            imgURL = this.state.userProfile.photoURL;
          }
        });
      }
      displayName = this.state.userProfile.displayName;
      var displayNameHtml = <div className={classes.displayName}>{displayName}</div>;
      imageHtml =  <img className={classes.profileImage} src={imgURL} alt="Profile"/>;
      if(this.state.userProfile.desc  != null  && this.state.userProfile.desc !== "") {
        desc = <div>{this.state.userProfile.desc}</div>
      }
      publishMessage = <EventListDialog title="發表事件: " displayName={displayName} messageIds={this.publishMessages}/>
      completeMessage = <EventListDialog title="完成事件: " displayName={displayName} messageIds={this.completeMessages}/>
      missionHtml = <MissionView user={this.state.user} userProfile={this.state.userProfile} addressList={this.state.addressBook.addresses} bookmarkList={this.state.bookmarkList} publicProfileView={true}/>
      if(this.state.userProfile.fbuid) {
        this.fbId=this.state.userProfile.fbuid;
      }
      bookmarkHtml = (
        <span>
          <div className={classes.subheader}>{constant.bookmarkTitleLabel}</div>
          <BookmarkList bookmarkList={this.state.bookmarkList} />
        </span>
      )
    }

    if(this.state.link){
     facebookhtml =
     <ListItem button >
      <ListItemText primary="臉書連結:"/> <a href={this.state.link} target="_blank">前往</a>
    </ListItem>;
    }

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
            <div className={classes.userInfo}>
                {imageHtml}
                {displayNameHtml}
                {desc}
                {facebookhtml}
            </div>
            <Divider/>
            {missionHtml}
            {publishMessage}
            {completeMessage}
            {bookmarkHtml}
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
