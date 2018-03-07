/*global FB*/
import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Form, Label, Input} from 'reactstrap';
import { FormGroup, FormControlLabel, FormText, FormControl } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import LocationButton from '../LocationButton';
import SelectedMenu from '../SelectedMenu';
import config from '../config/default';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Dialog, { 
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import InputLabel from 'material-ui/Input/InputLabel';
import IconButton from 'material-ui/IconButton';
import Collapse from 'material-ui/transitions/Collapse';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ReactDOM from 'react-dom';
import {addComment} from '../MessageDB';
import { geocode } from '@google/maps/lib/apis/geocode';


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

class PostCommentView extends Component {
  constructor(props) {
    super(props);
    this.state = {popoverOpen: false, buttonShow: false, 
      // comment
      commentSelection: '發表回應',
      text: "",
      geolocation: null,
      streetAddress: null,
      changeStatus: null,
      createdAt: null,
      link: null};
  }

  static defaultProps = {
    commentOptions : ['發表回應', '要求更改地點', '要求更改現況', '要求更改外部連結'],    
    statusOptions : ['開放', '完結', '政府跟進中', '虛假訊息', '不恰當訊息']
  }

  componentDidMount() {
    var auth = firebase.auth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({buttonShow: true});
      }
    });
  }
  

  handleRequestOpen(evt) {
    evt.preventDefault();
    console.log("Request for open " + this.state.popoverOpen);
    this.setState({
     // Comment
        commentSelection: '發表回應',
        text: "",
        geolocation: null,
        streetAddress: null,
        changeStatus: null,
        createdAt: null,
        hide: false,
        link: null,
        popoverOpen: true,
        anchorEl: evt.currentTarget
    });
  }

  handleClose() {
    this.setState({popoverOpen: false});
  };

  onSubmit() {
    var auth = firebase.auth();
    auth.onAuthStateChanged((user) => {
        if (user) {
            var photo = null;
            var commentText = null;
            var tags = null;
            var geolocation = null;
            var streetAddress = null;
            var link = null;
            var status = null;
            switch(this.state.commentSelection) {
                case  "發表回應":
                    commentText = this.state.text;
                    break;
                case "要求更改現況": 
                    status = this.state.changeStatus;
                    break;
                case "要求更改地點": 
                    geolocation = this.locationButton.geolocation;
                    streetAddress = this.locationButton.streetAddress;
                    break;
                case "要求更改外部連結":
                    link = this.state.link;
                    break;
            }
            this.setState({popoverOpen: false});
            addComment(this.props.messageUUID, user, photo, commentText, tags, geolocation, streetAddress, link, status).then(function(commentId){           
                return commentId;
            })
        }
        this.setState({popoverOpen: false});
        return null;
    });
  }

  commentOptionSelection(selectedValue) {
      this.setState({commentSelection: selectedValue});
  }

  render() {
    const classes = this.props.classes;
    if(this.state.buttonShow) {
        let inputHtml = <TextField autoFocus required id="message" fullWidth margin="normal" helperText="更新事件進度及期望街坊如何參與" value={this.state.text} onChange={event => this.setState({ text: event.target.value })}/>;
        if(this.state.commentSelection != "發表回應") {
            switch(this.state.commentSelection) {
                case "要求更改現況":
                    inputHtml = <SelectedMenu autoFocus label="" options={this.props.statusOptions} changeSelection={(selectedValue) => this.setState({changeStatus: selectedValue})} ref={(statusSelection) => {this.statusSelection = statusSelection}}/>;
                    break;
                case "要求更改地點":
                    inputHtml = <LocationButton autoFocus ref={(locationButton) => {this.locationButton = locationButton;}}/>;
                    break;
                case "要求更改外部連結":
                    inputHtml = <TextField autoFocus id="link" className={classes.textField} value={this.state.link} onChange={event => this.setState({ link: event.target.value })}/>;
                    break;
            }
        }
      return (
        <span>
            <Button variant="fab" color="primary" className={classes.fab} raised={true} onClick={(evt) => this.handleRequestOpen(evt)}>
                <AddIcon />
            </Button>
            <Dialog
                open={this.state.popoverOpen}
                onClose={() => this.handleClose()}
                aria-labelledby="form-dialog-title"
                unmountOnExit>
                <DialogTitle id="form-dialog-title">更新參與進度</DialogTitle>
                <DialogContent>
                    <DialogContentText>選擇更新範圍</DialogContentText>
                    <SelectedMenu label="" options={this.props.commentOptions} changeSelection={(selectedValue) => this.commentOptionSelection(selectedValue)} ref={(commentSelection) => {this.commentSelection = commentSelection}}/>
                    {inputHtml}
                </DialogContent>  
                <DialogActions>
                    <Button color="primary" onClick={() => this.handleClose()} >取消</Button>
                    <Button color="primary" onClick={() => this.onSubmit()}>提交</Button> 
                </DialogActions>          
            </Dialog>     
        </span>
      )
    } else {
      return (<div/>);
    }
  }
};


export default withStyles(styles, { withTheme: true })(PostCommentView);
