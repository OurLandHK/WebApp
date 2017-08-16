/*global FB*/
import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import LocationButton from './LocationButton';
import postMessage from './PostMessage';
import config from './config/default';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Dialog, { DialogTitle } from 'material-ui/Dialog';


class PostMessageView extends Component {
  constructor(props) {
    super(props);
    this.state = {popoverOpen: false};
    this.messageInput = null;
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

  componentDidMount() {
    this.loadFBLoginApi();
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

  render() {
    return (
      <span>
        <Button fab style={{marginRight:20}} mini={true} onClick={(evt) => this.handleRequestOpen(evt)}>
          <AddIcon />
        </Button>
        <Dialog open={this.state.popoverOpen} onRequestClose={() => this.handleRequestClose()}>
            <div>
            <Form>
              <FormGroup>
                <Label for="message">Message</Label>
                <Input type="textarea" name="text" id="message" getRef={(input) => {this.messageInput = input;}} />
              </FormGroup>
              <FormGroup>
                <Label for="file">File</Label>
                <input type="file" name="file" id="file" ref={(file) => {this.file = file;}}/>
              </FormGroup>
            </Form>
            </div>
            <LocationButton ref={(locationButton) => {this.locationButton = locationButton;}}/>&nbsp;&nbsp;&nbsp;<Button color="info" onClick={() => this.onSubmit()}>Submit</Button>
       </Dialog>     
      </span>
    )
  }
};

export default PostMessageView;
