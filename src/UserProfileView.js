/*global FB*/
import React, { Component } from 'react';
import { Form, FormGroup, Label, Input} from 'reactstrap';
import { FormText, FormControl } from 'material-ui/Form';
import LocationButton from './LocationButton';
import config from './config/default';
import Button from 'material-ui/Button';
import AddIcon from '@material-ui/icons/Add';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import InputLabel from 'material-ui/Input/InputLabel';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from 'material-ui/transitions/Slide';
import geoString from './GeoLocationString';
import EventListDialog from './EventListDialog';
import {getUserProfile, updateUserLocation, getUserRecords, updateUserProfile} from './UserProfile';
import UploadImageButton from './UploadImageButton';
import uuid from 'js-uuid';
import thunk from 'redux-thunk';  
import {connect} from "react-redux";
import {
  checkAuthState
} from './actions';
import  {constant} from './config/default';

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
            desc: ''
        };
        this.path = 'UserProfile';
        this.thumbnailFilename = 'profile_' + id + '.jpg';
        this.openDialog = this.openDialog.bind(this);
        this.props.openDialog(this.openDialog);
    }    

  openDialog = () => {
    console.log('UserProfile Open'); 
    this.setState({ open: true });
  };

  handleRequestClose = () => {
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
          this.setState({
            user: user.user, 
            userProfile: user.userProfile,
            displayName: user.userProfile.displayName,
            displayRole: '權限: ' + user.userProfile.role,
            desc: desc});
        } else {
          this.setState({user: user.user});         
        }
      } else {
        this.setState({user: null, userProfile: null});
      }
    }
  }

  onSubmit() {
    this.setState({ open: false });
    /*
      Updating User Profile Image in DB
    */
    var userProfile = this.state.userProfile;
    if(this.state.thumbnailPublicImageURL != null) {
      userProfile.photoURL = this.state.thumbnailPublicImageURL;
    }
    if(this.state.displayName != "") {
      userProfile.displayName = this.state.displayName;
    }
    userProfile.desc = this.state.desc;
    var rv = updateUserProfile(this.state.user, userProfile);

    if(rv){
      this.setState({userProfile: userProfile});
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

  render() {
    const { classes } = this.props;
    var imgURL = '/images/profile_placeholder.png';
    var publish = 0;
    var concern = 0;
    var complete = 0;
    let concernMessage = null;
    let publishMessage = null;
    let completeMessage = null; 
    let dialogHtml = null;
    if (this.state.user != null && this.state.userProfile != null) {
        imgURL = this.state.userProfile.photoURL;
        this.path = "UserProfile/" + this.state.user.uid + "/";
        var desc = '';
        if(this.state.userProfile.desc) {
          desc = this.state.userProfile.desc;
        }
        if(this.state.userProfile != null)
        {
          publishMessage = <EventListDialog title="發表事件: " messageIds={this.state.userProfile.publishMessages}/>
          completeMessage = <EventListDialog title="完成事件: " messageIds={this.state.userProfile.completeMessages}/> 
          concernMessage = <EventListDialog title="關注事件: " messageIds={this.state.userProfile.concernMessages}/>          
        }
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

            <br/>
            <UploadImageButton ref={(uploadImageButton) => {this.uploadImageButton = uploadImageButton;}} thumbnailFilename={this.thumbnailFilename} isThumbnailOnly={true} path={this.path} uploadFinish={(imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL) => {this.uploadFinish(imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL);}}/>
          </FormGroup>
         
          <List>
            <ListItem >
              <ListItemText primary={this.state.displayRole} />
            </ListItem>          
            {publishMessage}
            {concernMessage}
            {completeMessage}                                  
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
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthState:
      () => dispatch(checkAuthState()),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UserProfileView));

