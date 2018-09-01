/*global FB*/
import React, { Component } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import config from './config/default';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText  from '@material-ui/core/ListItemText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import {fileExists, checkImageExists} from './util/http';
import {getUserProfile, updateUserLocation, getUserRecords, updateUserProfile} from './UserProfile';
import UploadImageButton from './UploadImageButton';
import IntegrationReactSelect from './IntegrationReactSelect';
import uuid from 'js-uuid';
import thunk from 'redux-thunk';  
import {connect} from "react-redux";
import {
  checkAuthState
} from './actions';
import  {constant , RoleEnum} from './config/default';

function Transition(props) {
  return <Slide direction="left" {...props} />;
}

/* eslint-disable flowtype/require-valid-file-annotation */

const currentLocationLabel = "現在位置";
const officeLocationLabel = "辦公室位置";
const homeLocationLabel = "屋企位置";

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

class UserProfileView extends React.Component {
    constructor(props) {
        super(props);
        this.onBackButtonEvent = this.onBackButtonEvent.bind(this);
        var id = uuid.v4();
        this.state = {
            open: false,
            user: null, 
            imageURL: null, 
            publicImageURL: null, 
            thumbnailImageURL: null, 
            thumbnailPublicImageURL: null,
            displayName: '',
            displayRole: '權限: ',
            desc: '',
            emailAddress: '',
            interestedTags: [],
            multiLabel: ''
        };
        this.path = 'UserProfile';
        this.thumbnailFilename = 'profile_' + id + '.jpg';
        this.openDialog = this.openDialog.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
        this.props.openDialog(this.openDialog);
    }    

  openDialog = () => {
    this.lastOnPopState = window.onpopstate;
    window.onpopstate = this.onBackButtonEvent;
    console.log('UserProfile Open'); 
    this.setState({ open: true });
  };

  onBackButtonEvent(e) {
    e.preventDefault();
    this.handleRequestClose();
  }
    

  handleRequestClose = () => {
    window.onpopstate = this.lastOnPopState;
    this.setState({ open: false });
  };


  componentDidUpdate(prevProps, prevState) {
    if ((this.props.user.user != null && this.state.user == null) ||  (prevProps.user != this.props.user)) {
      const {user} = this.props;
      if (user.user) {
        if(user.userProfile != null){
          var desc = '';
          if(user.userProfile.desc != null) {
            desc = user.userProfile.desc;
          }

          var emailAddress = '';
          if(user.userProfile.emailAddress != null) {
            emailAddress = user.userProfile.emailAddress;
          }

          var interestedTags = [];
          if(user.userProfile.interestedTags != null) {
            interestedTags = user.userProfile.interestedTags;
            console.log(interestedTags)
          }


          var multiLabel = '';
          multiLabel = this.interestedTagsToMultiLabel(interestedTags)
          console.log("multiLabel=" + multiLabel)
          this.setState({
            user: user.user, 
            userProfile: user.userProfile,
            displayName: user.userProfile.displayName,
            displayRole: '權限: ' + user.userProfile.role,
            desc: desc,
            emailAddress: emailAddress,
            interestedTags: interestedTags,
            multiLabel: multiLabel});


        } else {
          this.setState({user: user.user});         
        }
      } else {
        this.setState({user: null, userProfile: null});
      }
    }
  }

  interestedTagsToMultiLabel(interestedTags){
    var tags = [];
    interestedTags.map(interestedTag => {
      tags.push(interestedTag.text);
    });

    return tags.join();
  }

  onSubmit() {
    var error = 0;
    /*
      User's Profile Image
    */
    var userProfile = this.state.userProfile;
    if(this.state.thumbnailPublicImageURL != null) {
      userProfile.photoURL = this.state.thumbnailPublicImageURL;
    }

    /*
      User's Display Name
    */
    if(this.state.displayName != "") {
      userProfile.displayName = this.state.displayName;
    }

    /*
      User's Description
    */
    userProfile.desc = this.state.desc;

    /*
      User's Interested Tags
    */
    userProfile.interestedTags = this.state.interestedTags;

    /*
      User's Email Address
    */
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(this.state.emailAddress != '' && !regExp.test(this.state.emailAddress)) {
      error = 1;
    }else {
      userProfile.emailAddress = this.state.emailAddress;
    }
  
    if(!error) {
      var rv = updateUserProfile(this.state.user, userProfile);

      if(rv){
        this.setState({userProfile: userProfile});
      }

      this.setState({ open: false });
    } else {
      alert("Incorrect Email Address Format");
    }
  } 

  uploadFinish(imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL) {  
    this.setState({
      imageURL: imageURL, 
      publicImageURL: publicImageURL, 
      thumbnailImageURL: thumbnailImageURL, 
      thumbnailPublicImageURL: thumbnailPublicImageURL
    });
    }

  handleTagChange(value) {
    let interestedTags = [];
    if(value != null && value != '') {
      var partsOfStr = value.split(',');
      let i = 0;
      partsOfStr.forEach(function(element) {
        interestedTags.push({
          id: interestedTags.length + 1,
          text: element
        });
      });
    }
    
    this.setState({interestedTags});
  }
  render() {
    const { classes, user } = this.props;
    var imgURL = '/images/profile_placeholder.png';
    var publish = 0;
    var concern = 0;
    var complete = 0;
    let concernMessage = null;
    let publishMessage = null;
    let completeMessage = null; 
    let emailHtml = null;
    let dialogHtml = null;
    if (this.state.user != null && this.state.userProfile != null) {
        if(checkImageExists(this.state.userProfile.photoURL)) {
          imgURL = this.state.userProfile.photoURL;
        }
        this.path = "UserProfile/" + this.state.user.uid + "/";
        var desc = '';
        if(this.state.userProfile.desc) {
          desc = this.state.userProfile.desc;
        }
    }
    if(user != null && user.userProfile != null && (user.userProfile.role == RoleEnum.admin ||  user.userProfile.role == RoleEnum.betaUser || user.userProfile.role == RoleEnum.monitor)) {
      emailHtml = <TextField
                  id="emailAddress"
                  label="電郵地址"
                  fullWidth
                  margin="normal"
                  helperText="相關社區資訊將會傳到該電郵地址"
                  value={this.state.emailAddress}
                  onChange={event => this.setState({ emailAddress: event.target.value })}
                  inputRef={(tf) => {this.emailAddressTextField = tf;}}
                />;
    }
    return (
      <Dialog fullScreen  open={this.state.open} onRequestClose={this.handleRequestClose} transition={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              <img src={imgURL} style={{height:"20px", width:"20px"}}/>&nbsp;&nbsp;{"使用者設定"}
            </Typography>           
            <Button color="contrast" onClick={() => this.onSubmit()}>
              更新
            </Button>
          </Toolbar>
        </AppBar>

         <div className={classes.container}>
          <FormGroup>  
          <TextField
            autoFocus
            required
            id="name"
            label="姓名"
            fullWidth
            margin="normal"
            value={this.state.displayName}
            onChange={event => this.setState({ displayName: event.target.value })}
            inputRef={(tf) => {this.nameTextField = tf;}}
          />
          <TextField
            id="desc"
            label="個人簡介"
            fullWidth
            margin="normal"
            helperText="介紹自己,或寫下聯絡方法"
            value={this.state.desc}
            onChange={event => this.setState({ desc: event.target.value })}
            inputRef={(tf) => {this.descTextField = tf;}}
          />
            {emailHtml}
          <IntegrationReactSelect
            showLabel={false}
            placeholder={constant.interestedTagPlaceholder}
            suggestions={this.props.suggestions.tag}
            value={this.state.multiLabel}
            onChange={(value) => this.handleTagChange(value)}
          />
            <br/>
            <UploadImageButton ref={(uploadImageButton) => {this.uploadImageButton = uploadImageButton;}} thumbnailFilename={this.thumbnailFilename} isThumbnailOnly={true} path={this.path} uploadFinish={(imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL) => {this.uploadFinish(imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL);}}/>
          </FormGroup>
         
          <List>
            <ListItem >
              <ListItemText primary={this.state.displayRole} />
            </ListItem>                                         
          </List>
        </div>
        </Dialog>
    );
  }
}

UserProfileView.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    suggestions: state.suggestions
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthState:
      () => dispatch(checkAuthState()),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UserProfileView));

