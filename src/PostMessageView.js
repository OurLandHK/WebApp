/*global FB*/
import React, { Component } from 'react';
import {connect} from "react-redux";
import { Form, Label, Input} from 'reactstrap';
import uuid from 'js-uuid';
import classnames from 'classnames';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import LocationButton from './LocationButton';
import postMessage from './PostMessage';
import SelectedMenu from './SelectedMenu';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import config, {constant} from './config/default';
import UploadImageButton from './UploadImageButton';
import IntegrationReactSelect from './IntegrationReactSelect';
import SignInButton from './SignInButton';
import {
  checkAuthState,
  updateRecentMessage,
} from './actions';



const styles = theme => ({
  root: {
    flexGrow: 1,
    top: 'auto',
    bottom: 40,
    position: 'fixed',
  },
  hidden: {
    display: 'none',
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
    let key = uuid.v4();
    this.state = {popoverOpen: false, buttonShow: false,
      // message
      key: key,
      summary: "",
      link: "",
      start: this.today(),
      startTime: this.startTime(),
      end: this.today(),
      status: "開放",
      expanded: false,
      isUrgentEvent: false,
      opennings: this.props.opennings,
      timeSelection: constant.timeOptions[0],
      intervalSelection: this.props.intervalOptions[0],
      durationSelection: this.props.durationOptions[0],
      openningSelection: this.props.openningOptions[0],
      tags: []};
    this.handleRequestDelete = this.handleRequestDelete.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
    this.renderWeekdayHtml = this.renderWeekdayHtml.bind(this);
    this.renderOpenningHtml = this.renderOpenningHtml.bind(this);
    this.renderActivitiesHtml = this.renderActivitiesHtml.bind(this);
    this.setOpenning = this.setOpenning.bind(this);
    this.summaryTextField = null;
  }

  static defaultProps = {
    weekdayLabel : constant.weekdayLabel,
    openningOptions : constant.openningOptions,
    intervalOptions : constant.intervalOptions,
    durationOptions : constant.durationOptions,
    openning :  {enable: true, open: '09:00', close: '17:00'},
    opennings : [
      {enable: true, open: '09:00', close: '17:00'}, // all days
      {enable: true, open: '09:00', close: '17:00'}, // sun
      {enable: true, open: '09:00', close: '17:00'}, // mon
      {enable: true, open: '09:00', close: '17:00'}, // tue
      {enable: true, open: '09:00', close: '17:00'}, // wed
      {enable: true, open: '09:00', close: '17:00'}, // thur
      {enable: true, open: '09:00', close: '17:00'}, // fri
      {enable: true, open: '09:00', close: '17:00'}, // sat
      ]
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
      start: this.today(),
      startTime: this.startTime(),
      end: this.today(),
      expanded: false, rotate: 'rotate(0deg)',
      isUrgentEvent: false,
      tags: [],
      popoverOpen: true,
      timeSelection: constant.timeOptions[0],
      anchorEl: evt.currentTarget,
      imageURL: null,
      publicImageURL: null,
      thumbnailImageURL: null,
      thumbnailPublicImageURL: null,
      timeSelection: constant.timeOptions[0],
      opennings: this.props.opennings,
      intervalSelection: this.props.intervalOptions[0],
      durationSelection: this.props.durationOptions[0],
      openningSelection: this.props.openningOptions[0],
      locationTipOpen: false,
    });
  }

  handleRequestClose() {
  //  this.uploadImageButton.onDelete();
    this.setState({
      popoverOpen: false,
    });
  };

  onSubmit() {
    console.log(" expand:  " + this.state.expanded + " " + this.state.intervalSelection + " " + this.state.durationSelection + " " + this.state.start)
    let interval = null;
    let duration = null;
    let startDate = null;
    let startTime = null;
    let everydayOpenning = null;
    let weekdaysOpennings = null;
    let endDate = null;
    if(this.state.expanded) { // detail for time
      startDate = this.state.start;
      // console.log('Now Time ' + startTimeInMs+ ' ' + this.state.start);
      switch(this.state.timeSelection) {
        case constant.timeOptions[0]:
          interval = this.state.intervalSelection;
          duration = this.state.durationSelection;
          startTime = this.state.startTime;
          if(this.state.intervalSelection != this.props.intervalOptions[0]) {
            endDate = this.state.end;
          }
          break;
        default:
          switch(this.state.openningSelection) {
            case this.props.openningOptions[0]:
              everydayOpenning = this.state.opennings[0];
            break;
            case this.props.openningOptions[1]:
              weekdaysOpennings = [this.state.opennings[1], this.state.opennings[2], this.state.opennings[3], this.state.opennings[4], this.state.opennings[5], this.state.opennings[6], this.state.opennings[7]]
            break;
          }
      }
    }
    if (this.state.summary == null || this.state.summary.length == 0) {
      this.summaryTextField.select();
    } else if (this.state.geolocation == null) {
      //this.locationButton.handleClickOpen();
      this.setState({locationTipOpen: true});
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

      var tags = this.state.tags.map((tag) => tag.text);
      postMessage(this.state.key, this.props.user.user, this.props.user.userProfile, this.state.summary, tags, this.state.geolocation, this.state.streetAddress,
        startDate, duration, interval, startTime, everydayOpenning, weekdaysOpennings, endDate, this.state.link,
        imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL,
        this.state.status, this.state.isUrgentEvent).then((messageKey) => {
          const { updateRecentMessage, checkAuthState} = this.props;
          if(messageKey != null && messageKey != "") {
            updateRecentMessage(messageKey, false);
            checkAuthState();
          }
        });
      this.setState({
        popoverOpen: false
      });
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
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

  setOpenning(index, type,  value) {
    let opennings = this.state.opennings;
    opennings[index][type] = value;
    this.setState({opennings: opennings});
  }

  timeOptionSelection(selectedValue) {
    this.setState({timeSelection: selectedValue});
  }

  intervalOptionSelection(selectedValue) {
    this.setState({intervalSelection: selectedValue});
  }

  durationOptionSelection(selectedValue) {
    this.setState({durationSelection: selectedValue});
  }
  openningOptionSelection(selectedValue) {
    this.setState({openningSelection: selectedValue});
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

  locationButtonSubmit = (geolocation, streetAddress) => {
    console.log("locationButtonSubmit ");
    this.setState({
        geolocation: geolocation,
        streetAddress: streetAddress,
        locationTipOpen: false,
    });
  };


  uploadFinish(imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL) {
    this.setState({
      imageURL: imageURL,
      publicImageURL: publicImageURL,
      thumbnailImageURL: thumbnailImageURL,
      thumbnailPublicImageURL: thumbnailPublicImageURL
    });
//    console.log("uploadFinish: " + this.state.imageURL + " " + this.state.publicImageURL+ " " + this.state.thumbnailImageURL+ " " + this.state.thumbnailPublicImageURL)
  }

  today() {
    let now = new Date();
    return `${now.getFullYear()}-${("0" + now.getMonth()).slice(-2)}-${("0" + now.getDate()).slice(-2)}`;
  }

  startTime() {
    let now = new Date();
    return `${("0" + now.getHours()).slice(-2)}:${("0" + now.getMinutes()).slice(-2)}`;
  }

  renderWeekdayHtml(label, index) {
    const classes = this.props.classes;
    let openningHours = constant.closeWholeDay;
    if(this.state.opennings[index].enable) {
      openningHours = <div>
                  <TextField
                    id={`open${index}`}
                    type="time"
                    defaultValue={this.state.opennings[index].open}
                    className={classes.textField}
                    onChange={event => this.setOpenning(index, 'open', event.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                  /> 至 <TextField
                  id={`close${index}`}
                  type="time"
                  defaultValue={this.state.opennings[index].close}
                  className={classes.textField}
                  onChange={event => this.setOpenning(index, 'close', event.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                />
        </div>;
    }
    return(
      <Toolbar>
        <FormControlLabel
          label={label}
          control={
            <Checkbox
              id={label}
              checked={this.state.opennings[index].enable}
              onChange={() => this.setOpenning(index, 'enable', !this.state.opennings[index].enable)}
            />
            }
          />
        {openningHours}
      </Toolbar>
    );
  }

  renderOpenningHtml() {

    let today = this.today();
    let startTime = this.startTime();
    let endDateHtml = null;
    let openningHtml = null;
    const classes = this.props.classes;
    switch(this.state.openningSelection) {
      case this.props.openningOptions[0]:
        openningHtml = <Toolbar>
                  <TextField
                    id="open"
                    type="time"
                    defaultValue={this.state.opennings[0].open}
                    className={classes.textField}
                    onChange={event => this.setOpenning(0, 'open', event.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                  /> 至 <TextField
                  id="close"
                  type="time"
                  defaultValue={this.state.opennings[0].close}
                  className={classes.textField}
                  onChange={event => this.setOpenning(0, 'close', event.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                />
        </Toolbar>
        break;
      default:
        let i = 0;
        openningHtml = this.props.weekdayLabel.map((label) => {
          i++;
          return this.renderWeekdayHtml(label, i);
        });
        break;
    }
    return (<div>
      <Toolbar>
        <TextField
          id="start"
          label="開始日期"
          type="date"
          defaultValue={today}
          className={classes.textField}
          margin="normal"
          onChange={event => this.setState({ start: event.target.value })}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <SelectedMenu label="" options={this.props.openningOptions} changeSelection={(selectedValue) => this.openningOptionSelection(selectedValue)} />
      </Toolbar>
      {openningHtml}
    </div>);
  }

  renderActivitiesHtml() {

    let today = this.today();
    let startTime = this.startTime();
    let endDateHtml = null;
    const classes = this.props.classes;
    if(this.state.intervalSelection != this.props.intervalOptions[0]) {
    endDateHtml = <TextField
            id="end"
            label="完結日期"
            type="date"
            defaultValue={today}
            className={classes.textField}
            margin="normal"
            onChange={event => this.setState({ end: event.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
    }

    return (<div>
      <Toolbar>
        <TextField
          id="start"
          label="開始日期"
          type="date"
          defaultValue={today}
          className={classes.textField}
          margin="normal"
          onChange={event => this.setState({ start: event.target.value })}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="startTime"
          label="開始時間"
          type="time"
          defaultValue={startTime}
          className={classes.textField}
          onChange={event => this.setState({ startTime: event.target.value })}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
        />
      </Toolbar>
      <Toolbar>
        <SelectedMenu label="為期" options={this.props.durationOptions} changeSelection={(selectedValue) => this.durationOptionSelection(selectedValue)} ref={(durationSelection) => {this.durationSelection = durationSelection;}}/>
      </Toolbar>
      <Toolbar>
        <SelectedMenu label="" options={this.props.intervalOptions} changeSelection={(selectedValue) => this.intervalOptionSelection(selectedValue)}ref={(intervalSelection) => {this.intervalSelection = intervalSelection;}}/>
        {endDateHtml}
      </Toolbar>
    </div>);
  }

  render() {
    let startTime = new Date().toLocaleTimeString();
    let timeHtml = null;
    let postButtonHtml =  <Button size="small" variant="extendedFab" color="primary" onClick={(evt) => this.handleRequestOpen(evt)}>
                            +報料
                          </Button>;
    const classes = this.props.classes;
    const { tags } = this.state;
    if(this.locationButton != null && this.locationButton.geolocation != null) {
      console.log("Geolocation:" + this.locationButton.geolocation);
    }
    if(this.state.buttonShow) {
      if(this.state.expanded) {
        switch(this.state.timeSelection) {
          case constant.timeOptions[0]:
            timeHtml = this.renderActivitiesHtml();
            break;
          default:
            timeHtml = this.renderOpenningHtml();
            break;
        }
      }
      return (
        <div>
          {postButtonHtml}
          <Dialog
            fullScreen
            open={this.state.popoverOpen}
            onRequestClose={() => this.handleRequestClose()}
            transition={Transition}
            unmountOnExit>
            <AppBar className={classes.dialogTitle}>
              <DialogActions>
                <IconButton color="contrast" onClick={() => this.handleRequestClose()} aria-label="Close">
                  <CloseIcon />
                </IconButton>
                <Typography variant="title" color="inherit" className={classes.flex}> </Typography>
                <Button variant="raised" color="primary" onClick={() => this.onSubmit()}>報料</Button>
              </DialogActions>
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
                    placeholder="事件內容及期望街坊如何參與"
                    fullWidth
                    margin="normal"
                    value={this.state.summary}
                    onChange={event => this.setState({ summary: event.target.value })}
                    inputRef={(tf) => {this.summaryTextField = tf;}}
                  />
                  <IntegrationReactSelect
                    showLabel={false}
                    placeholder={constant.tagPlaceholder}
                    suggestions={this.props.suggestions.tag}
                    onChange={(value) => this.handleTagChange(value)}
                  />
                  <div className={classes.hidden}>
                    <TextField id="status" label="現況" className={classes.textField} disabled value={this.state.status} />
                  </div>
                  <br/>
                  <Tooltip
                      id="tooltip-controlled"
                      open={this.state.locationTipOpen}
                      placement="top-start"
                      title="請輸入事件位置"
                    >
                    <LocationButton ref={(locationButton) => {this.locationButton = locationButton;}} onSubmit={this.locationButtonSubmit}/>
                  </Tooltip>
                </FormGroup>
                <FormGroup>
                <UploadImageButton ref={(uploadImageButton) => {this.uploadImageButton = uploadImageButton;}} path={this.state.key} uploadFinish={(imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL) => {this.uploadFinish(imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL);}}/>
                </FormGroup>
                <FormGroup>
                    <TextField id="link" label="外部連結" className={classes.textField} value={this.state.link} onChange={event => this.setState({ link: event.target.value })}/>
                </FormGroup>
                <FormGroup>
                  <FormControlLabel
                  label="詳細時間"
                  control={
                    <Checkbox
                      checked={this.state.expanded}
                      onChange={() => this.handleExpandClick()}
                      value="checkedA" />
                    }
                  />
                </FormGroup>
                <Collapse in={this.state.expanded} transitionDuration="auto" unmountOnExit>
                  <FormGroup>
                    <SelectedMenu label="" options={constant.timeOptions} changeSelection={(selectedValue) => this.timeOptionSelection(selectedValue)} ref={(timeSelection) => {this.timeSelection = timeSelection}}/>
                    {timeHtml}
                  </FormGroup>
                  <br/>
                </Collapse>
                <FormGroup>
                  <FormControlLabel
                  label="緊急事項"
                  control={
                    <Checkbox
                      checked={this.state.isUrgentEvent}
                      onChange={this.handleChange('isUrgentEvent')}
                      value="isUrgentEvent" />
                    }
                  />
                </FormGroup>
              </Form>
              </div>
        </Dialog>
        </div>
      )
    } else {
      return (
        <div className="cta-report-wrapper">
          <SignInButton label="請先登入方可報料"/>
        </div>
      );
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
