/*global FB*/
import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Form, FormGroup, Label, Input} from 'reactstrap';
import { FormText, FormControl } from 'material-ui/Form';
import LocationButton from './LocationButton';
import postMessage from './PostMessage';
import config from './config/default';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import InputLabel from 'material-ui/Input/InputLabel';

const styles = theme => ({
  fab: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
  },  
});

class PostMessageView extends Component {
  constructor(props) {
    super(props);
    this.state = {popoverOpen: false, buttonShow: false};
    this.messageInput = null;
  }

  componentDidMount() {
    console.log('Found user login'); 
    var auth = firebase.auth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('Login'); 
        this.setState({buttonShow: true});
      }
    });
    this.loadFBLoginApi();
  }
  

  handleRequestOpen(evt) {
    evt.preventDefault();
    this.setState({
      popoverOpen: true,
      anchorEl: evt.currentTarget
    });
  }

  handleRequestClose() {
    this.setState({
      popoverOpen: false,
    });
  };

  loadFBLoginApi() {
    window.fbAsyncInit = function() {
            FB.init(config.fbApp);
        };

        console.log("Loading fb api");
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
    console.log(this.messageInput.value);
    console.log(this.file.files);
    console.log(this.file);
    console.log(this.file.files[0]);
    console.log(this.locationButton.geolocation);
    if (this.locationButton.geolocation == null) {
      console.log('Unknown Location'); 
    } else {
      var tags = ['Testing', 'Tags'];
      postMessage(this.messageInput.value, this.file.files[0], tags, this.locationButton.geolocation);
    }
  }

  handleChange = event => {
    this.setState({ name: event.target.value });
  };

  render() {
    const classes = this.props.classes;
    if(this.state.buttonShow) {
      return (
        <span>
          <Button fab color="primary" className={classes.fab} raised={true} onClick={(evt) => this.handleRequestOpen(evt)}>
            <AddIcon />
          </Button>
          <Dialog open={this.state.popoverOpen} onRequestClose={() => this.handleRequestClose()}>
              <div>
              <Form>
                <FormGroup>
                  <Label for="message">簡介</Label>
                  <Input type="textarea" name="text" id="message" getRef={(input) => {this.messageInput = input;}} />
                </FormGroup>
                <FormGroup>
                  <Label for="locations">地點</Label>
                  <LocationButton ref={(locationButton) => {this.locationButton = locationButton;}}/>&nbsp;&nbsp;&nbsp;<Button color="info" onClick={() => this.onSubmit()}>Submit</Button>
                </FormGroup>   
                <FormGroup>                
                  <Label for="file">相片</Label>
                  <input type="file" name="file" id="file" ref={(file) => {this.file = file;}}/>
                </FormGroup>                          
                <FormGroup>
                  <Label for="tags">分類</Label>
                  <Chip label="Testing"  />
                </FormGroup>
                <FormControl className={classes.formControl} disabled>
                  <InputLabel htmlFor="status">現況</InputLabel>
                  <Input id="status" value={this.state.status} onChange={() => this.handleChange()} />
                </FormControl>                          
                <FormGroup>                
                  <TextField
                    id="start"
                    label="開始"
                    type="datetime-local"
                    defaultValue="現在"
                    className={classes.textField}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormGroup>              
                <FormGroup>                
                  <Label for="end">完結</Label>
                  <Input type="textarea" name="text" id="tags" getRef={(input) => {this.messageInput = input;}} />
                </FormGroup>     
                <FormGroup>                
                  <Label for="Interval">週期</Label>
                  <Input type="textarea" name="text" id="tags" getRef={(input) => {this.messageInput = input;}} />
                </FormGroup> 
                <FormGroup>                
                  <Label for="link">外部連結</Label>
                  <Input type="textarea" name="text" id="tags" getRef={(input) => {this.messageInput = input;}} />
                </FormGroup>                                          
              </Form>
              </div>
        </Dialog>     
        </span>
      )
    } else {
      return (<div/>);
    }
  }
};

export default withStyles(styles) (PostMessageView);
