/*global FB*/
import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Form, Label, Input} from 'reactstrap';
import { FormGroup, FormControlLabel, FormText, FormControl } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import LocationButton from './LocationButton';
import postMessage from './PostMessage';
import SelectedMenu from './SelectedMenu';
import config, {constant} from './config/default';
import Button from 'material-ui/Button';
import AddIcon from '@material-ui/icons/Add';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import InputLabel from 'material-ui/Input/InputLabel';
import IconButton from 'material-ui/IconButton';
import Collapse from 'material-ui/transitions/Collapse';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import FileUploadIcon from '@material-ui/icons/FileUpload';
import Slide from 'material-ui/transitions/Slide';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReactDOM from 'react-dom';
import UploadImageButton from './UploadImageButton';
import IntegrationReactSelect from './IntegrationReactSelect';
import uuid from 'js-uuid';
import {
  checkAuthState,
  updateRecentMessage,
} from './actions';
import {connect} from "react-redux";


const styles = theme => ({
  hidden: {
    display: 'none',
  },
  fab: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
  flex: {
    flex: 1,
  },  
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  dialogContainer: {
    padding: '0.5rem'
  },
  dialogTitle: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'  
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class PostMessageView extends Component {
  constructor(props) {
    super(props);
    var key = uuid.v4();
    this.state = {popoverOpen: false, buttonShow: false, 
      // message
      key: key,
      summary: "",
      link: "",
      start: "",
      end: "",
      status: "開放",
      expanded: false,
      tags: []};
    this.handleRequestDelete = this.handleRequestDelete.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
    this.summaryTextField = null;
  }

  static defaultProps = {
    intervalOptions : ['一次', '每週', '每兩週','每月'],
    durationOptions : ['0:30', '1:00', '1:30','2:00','3:00','4:00','6:00','8:00','10:00','12:00','18:00','一天','兩天','三天','四天','五天','六天','一週'],    
  }

  componentDidMount() {
    if (this.props.user != null && this.props.user.user != null) {
//      console.log("DidMount Enable Post");
      this.setState({buttonShow: true});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user != this.props.user && this.props.user != null) {
//      console.log("DidUpdate Enable Post");
      const {user} = this.props.user;
      if (user) {
        this.setState({buttonShow: true});
      } else {
        this.setState({buttonShow: false});
      }
    }
  }
  

  handleRequestOpen(evt) {
    evt.preventDefault();
    var key = uuid.v4();
    this.setState({
     // message
      key: key,
      summary: "",
      link: "",
      start: "",
      end: "",
      expanded: false, rotate: 'rotate(0deg)',
      tags: [],
      popoverOpen: true,
      anchorEl: evt.currentTarget,
      imageURL: null, 
      publicImageURL: null, 
      thumbnailImageURL: null, 
      thumbnailPublicImageURL: null
    });
  }

  handleRequestClose() {
  //  this.uploadImageButton.onDelete();
    this.setState({
      popoverOpen: false,
    });
  };

  onSubmit() {
    var interval = "";
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
      console.log('Now Time ' + startTimeInMs+ ' ' + this.state.start);
//      startTimeInMs = Date.parse('2018年4月15日 下午2:50');
//      console.log('Chinese Time ' + startTimeInMs);
//      startTimeInMs = new Date('2018年4月15日 下午2:50');
//      console.log('New Date Time ' + startTimeInMs);
    }
    if (this.state.summary == null || this.state.summary.length == 0) {
      this.summaryTextField.select();
    } else if (this.locationButton.geolocation == null) {
      this.locationButton.handleClickOpen();
    } else {
      var imageURL = null;
      var publicImageURL = null;
      var thumbnailImageURL = null;
      var thumbnailPublicImageURL = null;
      if(this.state.imageURL != null) {
        imageURL = this.state.imageURL;
      }
      if(this.state.publicImageURL != null) {
        publicImageURL = this.state.publicImageURL;
      }
      if(this.state.thumbnailImageURL != null) {
        thumbnailImageURL = this.state.thumbnailImageURL;
      }
      if(this.state.thumbnailPublicImageURL != null) {
        thumbnailPublicImageURL = this.state.thumbnailPublicImageURL;
      }      
      //console.log("Submit: " + imageURL + " " + publicImageURL+ " " + thumbnailImageURL+ " " + thumbnailPublicImageURL)
      
      var tags = this.state.tags.map((tag) => tag.text);
      postMessage(this.state.key, this.props.user.user, this.props.user.userProfile, this.state.summary, tags, this.locationButton.geolocation, this.locationButton.streetAddress, 
        startTimeInMs, duration, interval, this.state.link, 
        imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL,
        this.state.status).then((messageKey) => {
          const { updateRecentMessage, checkAuthState} = this.props;
          if(messageKey != null && messageKey != "") {
            updateRecentMessage(messageKey, false);
            checkAuthState();
          }
        });
      this.setState({popoverOpen: false});
    }
  }

  handleChange = event => {
    this.setState({ name: event.target.value });
  };

  handleExpandClick() {
    this.setState({ expanded: !this.state.expanded });
  };

  handleRequestDelete(evt) {
    alert(evt);
  }

  handleTouchTap(evt) {
    alert(evt);
  }

  handleTagChange(value) {
    let tags = [];
    if(value != null && value != '') {
      var partsOfStr = value.split(',');
      let i = 0;
      partsOfStr.forEach(function(element) {
        tags.push({
          id: tags.length + 1,
          text: element
        });
      });
    } 
    this.setState({tags: tags});
  }


  uploadFinish(imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL) {  
    this.setState({
      imageURL: imageURL, 
      publicImageURL: publicImageURL, 
      thumbnailImageURL: thumbnailImageURL, 
      thumbnailPublicImageURL: thumbnailPublicImageURL
    });
//    console.log("uploadFinish: " + this.state.imageURL + " " + this.state.publicImageURL+ " " + this.state.thumbnailImageURL+ " " + this.state.thumbnailPublicImageURL)
  }

  render() {
    var startTime = new Date().toLocaleTimeString();
    const classes = this.props.classes;
    const { tags } = this.state; 
    if(this.locationButton != null && this.locationButton.geolocation != null)
      console.log("Geolocation:" + this.locationButton.geolocation);
    if(this.state.buttonShow) {
      return (
        <span>
          <Button variant="fab" color="primary" className={classes.fab} raised={true} onClick={(evt) => this.handleRequestOpen(evt)}>
            <AddIcon />
          </Button>
          <Dialog
            fullScreen
            open={this.state.popoverOpen}
            onRequestClose={() => this.handleRequestClose()}
            transition={Transition}
            unmountOnExit>
            <AppBar className={classes.dialogTitle}>
              <Toolbar>
                <IconButton color="contrast" onClick={() => this.handleRequestClose()} aria-label="Close">
                  <CloseIcon />
                </IconButton>
                <Typography variant="title" color="inherit" className={classes.flex}>提交</Typography>     
              </Toolbar>
            </AppBar>
              <div className={classes.dialogContainer}>
              <br/>
              <br/>
              <br/>
              <Form>
                <FormGroup>           
                  <TextField
                    autoFocus
                    required
                    id="message"
                    label="簡介"
                    fullWidth
                    margin="normal"
                    helperText="介紹事件內容及期望街坊如何參與"
                    value={this.state.summary}
                    onChange={event => this.setState({ summary: event.target.value })}
                    inputRef={(tf) => {this.summaryTextField = tf;}}
                  />
                  <IntegrationReactSelect 
                    label={constant.tagLabel}
                    placeholder={constant.tagPlaceholder}
                    suggestions={this.props.suggestions.tag}
                    onChange={(value) => this.handleTagChange(value)}
                  />
                  <div className={classes.hidden}>
                    <TextField id="status" label="現況" className={classes.textField} disabled value={this.state.status} />                  
                  </div>
                  <br/>
                  <Label for="locations">地點</Label>
                  <LocationButton ref={(locationButton) => {this.locationButton = locationButton;}}/>
                </FormGroup>
                <FormGroup>  
                <br/>
                <UploadImageButton ref={(uploadImageButton) => {this.uploadImageButton = uploadImageButton;}} path={this.state.key} uploadFinish={(imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL) => {this.uploadFinish(imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL);}}/>
                </FormGroup>
                <FormGroup>    
                  <FormControlLabel
                  label="活動"
                  control={
                    <Checkbox
                      checked={this.state.expanded}
                      onChange={() => this.handleExpandClick()}
                      value="checkedA"
                    />
                    }
                  />                                                    
                </FormGroup>                                          
                <Collapse in={this.state.expanded} transitionDuration="auto" unmountOnExit>                
                  <FormGroup>                
                    <TextField
                      id="start"
                      label="開始"
                      type="datetime-local"
                      className={classes.textField}
                      margin="normal"
                      onChange={event => this.setState({ start: event.target.value })}                      
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <SelectedMenu label="為期" options={this.props.durationOptions} ref={(durationSelection) => {this.durationSelection = durationSelection;}}/>                  
                    </FormGroup> 
                  <SelectedMenu label="週期" options={this.props.intervalOptions} ref={(intervalSelection) => {this.intervalSelection = intervalSelection;}}/>                  
                  <FormGroup>                
                    <TextField id="link" label="外部連結" className={classes.textField} value={this.state.link} onChange={event => this.setState({ link: event.target.value })}/>
                  </FormGroup>                  
                  <br/>
                </Collapse>                    
                <Button variant="raised" color="primary" onClick={() => this.onSubmit()}>提交</Button> 
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


const mapStateToProps = (state, ownProps) => {
  return {
    geoLocation : state.geoLocation,
    user:         state.user,
    suggestions:  state.suggestions,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateRecentMessage:
      (recentMessageID, open) =>
        dispatch(updateRecentMessage(recentMessageID, open)),
    checkAuthState:
      () => dispatch(checkAuthState()),    
  }
};

export default withStyles(styles) (connect(mapStateToProps, mapDispatchToProps)(PostMessageView));
