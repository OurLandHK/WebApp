/*global FB*/
import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Form, FormGroup, Label, Input} from 'reactstrap';
import { FormText, FormControl } from 'material-ui/Form';
import LocationButton from './LocationButton';
import postMessage from './PostMessage';
import SelectedMenu from './SelectedMenu';
import config from './config/default';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import InputLabel from 'material-ui/Input/InputLabel';
import IconButton from 'material-ui/IconButton';
import Collapse from 'material-ui/transitions/Collapse';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import WebcamCapture from './WebCam';
import ReactDOM from 'react-dom';
import CustomTags from './CustomTags';

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
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
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

class PostMessageView extends Component {
  constructor(props) {
    super(props);
    this.state = {popoverOpen: false, buttonShow: false, 
      // message
      summary: "",
      link: "",
      start: "",
      end: "",
      expanded: false, rotate: 'rotate(0deg)',
      tags: []};
      this.handleRequestDelete = this.handleRequestDelete.bind(this);
      this.handleTouchTap = this.handleTouchTap.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
      this.handleAddition = this.handleAddition.bind(this);
      this.handleDrag = this.handleDrag.bind(this);
  }

  static defaultProps = {
    intervalOptions : ['一次', '每週', '每兩週','每月'],
    durationOptions : ['0:30', '1:00', '1:30','2:00','3:00'],    
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
        var tags = this.state.tags.map((tag) => tag.text);
        postMessage(this.state.summary, this.file.files[0], tags, this.locationButton.geolocation, startTimeInMs, duration, interval, this.state.link);
        this.setState({popoverOpen: false});
      }
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

  handleDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
  }

  handleAddition(tag) {
	let tags = this.state.tags;
	tags.push({
		id: tags.length + 1,
		text: tag
	});
	this.setState({tags: tags});
  }

  handleDrag(tag, currPos, newPos) {
	let tags = this.state.tags;

	// mutate array
	tags.splice(currPos, 1);
	tags.splice(newPos, 0, tag);

	// re-render
	this.setState({ tags: tags });
  }

  render() {
    var startTime = new Date().toLocaleTimeString();
    const classes = this.props.classes;
    const { tags } = this.state; 
    if(this.state.buttonShow) {
      return (
        <span>
          <Button fab color="primary" className={classes.fab} raised={true} onClick={(evt) => this.handleRequestOpen(evt)}>
            <AddIcon />
          </Button>
          <Dialog open={this.state.popoverOpen} onRequestClose={() => this.handleRequestClose()}>
              <DialogTitle className={classes.dialogTitle}>提交</DialogTitle>
              <div className={classes.dialogContainer}>
              <Form>
                <FormGroup>           
                  <TextField required id="message" label="簡介" fullWidth margin="normal" helperText="介紹事件內容及期望街坊如何參與" value={this.state.summary} onChange={event => this.setState({ summary: event.target.value })}/>                  
                  <Label for="tags">分類</Label>
                  <CustomTags tags={tags}
                    inline={false}
                    placeholder="新增標籤"
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag} /> 
                  <TextField id="status" label="現況" className={classes.textField} disabled value="開放" />                  
                  <Label for="locations">地點</Label>
                  <LocationButton ref={(locationButton) => {this.locationButton = locationButton;}}/>
                </FormGroup>                          
                <FormGroup>                     
                  <Label for="file">相片</Label>
                  <input type="file" name="file" id="file" ref={(file) => {this.file = file;}}/>
                  <IconButton
                        className={classnames(classes.expand, {
                            [classes.expandOpen]: this.state.expanded,
                        })}
                        onClick={() => this.handleExpandClick()}
                        aria-expanded={this.state.expanded}
                        aria-label="Show more"
                        >
                        <ExpandMoreIcon />
                  </IconButton>                   
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
                </Collapse>                    
                <Button raised color="primary" onClick={() => this.onSubmit()}>提交</Button> 
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
//export default PostMessageView;
