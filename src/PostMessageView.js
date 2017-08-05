/*global FB*/
import {Button} from 'reactstrap';
import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Popover, PopoverTitle, PopoverContent } from 'reactstrap';
import { Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import LocationButton from './LocationButton';
import postMessage from './PostMessage';
import config from './config/default';

class PostMessageView extends Component {
  constructor(props) {
    super(props);
    this.state = {popoverOpen: false};
    this.messageInput = null;
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

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
    postMessage(this.messageInput.value, this.file.files[0], geolocation);
  }

  render() {
    return (
      <span>
        <Button color="danger" id="Popover1" onClick={() => this.toggle()}>
          Post
        </Button>
        <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={() => this.toggle()}>
          <PopoverTitle>Submit</PopoverTitle>
          <PopoverContent>
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
            <LocationButton/>&nbsp;&nbsp;&nbsp;<Button color="info" onClick={() => this.onSubmit()}>Submit</Button>
          </PopoverContent>
        </Popover>
      </span>
    )
  }
};

export default PostMessageView;
