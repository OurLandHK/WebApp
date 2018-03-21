/*global FB*/
import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Form, Label, Input} from 'reactstrap';
import { FormGroup, FormControlLabel, FormText, FormControl } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
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
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import CloseIcon from 'material-ui-icons/Close';
import FileUploadIcon from 'material-ui-icons/FileUpload';
import Slide from 'material-ui/transitions/Slide';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ReactDOM from 'react-dom';
import CustomTags from './CustomTags';
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
    this.state = {popoverOpen: false, buttonShow: false, 
      // message
      summary: "",
      link: "",
      start: "",
      end: "",
      status: "開放",
      expanded: false, rotate: 'rotate(0deg)',
      tags: []};
    this.handleRequestDelete = this.handleRequestDelete.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.summaryTextField = null;
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
  }
  

  handleRequestOpen(evt) {
    evt.preventDefault();
    this.setState({
     // message
      summary: "",
      link: "",
      start: "",
      end: "",
      expanded: false, rotate: 'rotate(0deg)',
      tags: [],
      popoverOpen: true,
      anchorEl: evt.currentTarget
    });
  }

  handleRequestClose() {
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
    }
    if (this.state.summary.length == 0) {
      this.summaryTextField.select();
    } else if (this.locationButton.geolocation == null) {
      this.locationButton.handleClickOpen();
    } else {
      if(this.state.summary == null) {
        console.log('Unknown Input');
      } else {
        var tags = this.state.tags.map((tag) => tag.text);
        postMessage(this.state.summary, this.file.files[0], tags, this.locationButton.geolocation, this.locationButton.streetAddress, startTimeInMs, duration, interval, this.state.link, this.state.status);
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
              <br/>
              <div className={classes.dialogContainer}>
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
                  <Label for="tags">分類</Label>
                  <CustomTags tags={tags}
                    inline={false}
                    placeholder="新增標籤"
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag} /> 
                  <div className={classes.hidden}>
                    <TextField id="status" label="現況" className={classes.textField} disabled value={this.state.status} />                  
                  </div>
                  <br/>
                  <Label for="locations">地點</Label>
                  <LocationButton ref={(locationButton) => {this.locationButton = locationButton;}}/>
                </FormGroup>                          
                <FormGroup>                     
                  <br/>
                  <Label for="file">相片</Label>
                  <input
                    type="file"
                    name="file"
                    id="file"
                    className={classes.hidden}
                    ref={(file) => {this.file = file;}}
                  />
                </FormGroup>
                <Button
                  className={classes.uploadButton}
                  variant="raised"
                  component="label"
                  htmlFor="file"
                >
                  <FileUploadIcon />
                  上載相片
                </Button>
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
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
};


export default withStyles(styles) (connect(mapStateToProps, mapDispatchToProps)(PostMessageView));
