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
/*    var interval = "";
    if(this.intervalSelection != null)
    {
      interval = this.intervalSelection.selectedValue;
    }
    var duration = "";
    if(this.durationSelection != null)
    {
      duration = this.durationSelection.selectedValue;
    }
    var startTimeInMs = "";
    if(this.state.start !== "") {
      startTimeInMs = Date.parse(this.state.start);
    }
    console.log(startTimeInMs);
    console.log(this.state.summary);
    console.log(this.file.files[0]);              
    if (this.locationButton.geolocation == null) {
      console.log('Unknown Location'); 
    } else {
      if(this.state.summary == null) {
        console.log('Unknown Input');         
      } else {
        var tags = ['Testing', 'Tags'];
        postMessage(this.state.summary, this.file.files[0], tags, this.locationButton.geolocation, startTimeInMs, duration, interval, this.state.link);
        this.setState({popoverOpen: false});
      }
    }
*/    
  }
  

  render() {
    const { classes } = this.props;
    var imgURL = '/images/profile_placeholder.png';
    var displayName = 'nobody';
    if (this.state.user) {
        imgURL = this.state.user.photoURL;
        displayName = this.state.user.displayName
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
              <ListItemText primary="發表事件: " secondary="Tethys" />
            </ListItem>            
            <ListItem button>
              <ListItemText primary="關注事件" secondary="Tethys" />
            </ListItem>                        
            <ListItem button>
              <ListItemText primary="完成事件" secondary="Tethys" />
            </ListItem>                                   
            <Divider />            
            <ListItem>
              <ListItemText primary="屋企位置" secondary="Titania" /> 
              設定:<LocationButton ref={(locationButton) => {this.homeLocationButton = locationButton;}}/>
            </ListItem>
            <ListItem>
              <ListItemText primary="辦公室位置" secondary="Tethys" />
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

