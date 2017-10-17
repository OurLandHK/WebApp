/*global FB*/
import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Form, FormGroup, Label, Input} from 'reactstrap';
import { FormText, FormControl } from 'material-ui/Form';
import LocationButton from './LocationButton';
import config from './config/default';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
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
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import {getUserProfile, setUserAddress} from './UserProfile';

/* eslint-disable flowtype/require-valid-file-annotation */



const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};

class UserProfileView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            userProfile: null
        };
    }    

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
    this.props.parent.handleClose();
  };

  componentDidMount() {
    console.log('UserProfile login'); 
    var auth = firebase.auth();
    console.log(auth);
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({user: user});
        var userProfile = getUserProfile(user);
        this.setState({userProfile: userProfile});
        console.log(userProfile);
      }
    });
    this.loadFBLoginApi();
  }
  
  loadFBLoginApi() {
    window.fbAsyncInit = function() {
            FB.init(config.fbApp);
        };
          // Load the SDK asynchronously
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk')); 
  }

  onSubmit() {
    this.setState({ open: false });
    this.props.parent.handleClose();
    var userProfile = setUserAddress(this.state.user, this.homeLocationButton.geolocation, this.officeLocationButton.geolocation);
    console.log('update profile: ' + userProfile + ' address: ' + this.homeLocationButton.geolocation + ' : ' + this.officeLocationButton.geolocation);
  }
  

  render() {
    const { classes } = this.props;
    var imgURL = '/images/profile_placeholder.png';
    var displayName = 'nobody';
    var publish = 0;
    var concern = 0;
    var complete = 0;
    var workAddress = 'Not Set';
    var homeAddress = 'Not Set';
    if (this.state.user) {
        imgURL = this.state.user.photoURL;
        displayName = this.state.user.displayName
        if(this.state.userProfile)
        {
          if(this.state.userProfile.publishMessages != null)
          {
            publish = this.state.userProfile.publishMessages.length;
          }
          if(this.state.userProfile.completeMessages != null)
          {
            complete = this.state.userProfile.completeMessages.length;
          }
          if(this.state.userProfile.concernMessages != null)
          {
            concern = this.state.userProfile.concernMessages.length;
          }                
          if(this.state.userProfile.homeAddress != null)
          {
            homeAddress = this.state.userProfile.homeAddress;
          }
          if(this.state.userProfile.workAddress != null)
          {
            workAddress = this.state.userProfile.workAddress;
          }
        }
    }
    return (
      <div>
        <ListItemText primary="User Profile" onClick={this.handleClickOpen}/>
        <Dialog
          fullScreen
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
          transition={<Slide direction="right" />}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography type="title" color="inherit" className={classes.flex}>
                <img src={imgURL} style={{height:"20px", width:"20px"}}/>&nbsp;&nbsp;{displayName}
              </Typography>
              <Button color="contrast" onClick={() => this.onSubmit()}>
                save
              </Button>
            </Toolbar>
          </AppBar>
          <List>
            <ListItem button>
              <ListItemText primary="發表事件: " secondary={publish} />
            </ListItem>            
            <ListItem button>
              <ListItemText primary="關注事件" secondary={concern} />
            </ListItem>                        
            <ListItem button>
              <ListItemText primary="完成事件" secondary={complete} />
            </ListItem>                                   
            <Divider />            
            <ListItem>
              <ListItemText primary="屋企位置" secondary={homeAddress} /> 
              設定:<LocationButton ref={(locationButton) => {this.homeLocationButton = locationButton;}}/>
            </ListItem>
            <ListItem>
              <ListItemText primary="辦公室位置" secondary={workAddress} />
              設定:<LocationButton ref={(locationButton) => {this.officeLocationButton = locationButton;}}/>              
            </ListItem>            
          </List>
        </Dialog>
      </div>
    );
  }
}

UserProfileView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserProfileView);

