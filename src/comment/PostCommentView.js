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

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class PostCommentView extends Component {
  constructor(props) {
    super(props);
    this.state = {popoverOpen: false, buttonShow: false, 
      // comment
      text: "",
      geolocation: null,
      streetAddress: null,
      changeStatus: null,
      createdAt: null,
      link: null};
    this.commentSelection = '';
    this.handleRequestDelete = this.handleRequestDelete.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
  }

  static defaultProps = {
    commentOptions : ['發表回應', '要求更改地點', '要求更改現況', '要求更改外部連結'],    
    statusOptions : ['開放', '完結', '政府跟進中', '虛假訊息']
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
     // message
        text: "",
        geolocation: null,
        streetAddress: null,
        changeStatus: null,
        createdAt: null,
        link: null,
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
    // TODO Base on the select item to decide in what to submit
    this.setState({popoverOpen: false});
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

  render() {
    const classes = this.props.classes;
    if(this.state.buttonShow) {
      return (
        <span>
            <Button variant="fab" color="primary" className={classes.fab} raised={true} onClick={(evt) => this.handleRequestOpen(evt)}>
                <AddIcon />
            </Button>
            <Dialog
                open={this.state.popoverOpen}
                onRequestClose={() => this.handleRequestClose()}
                aria-labelledby="form-dialog-title"
                unmountOnExit>
                <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Update single field each time
                    </DialogContentText>
                    <SelectedMenu label="" options={this.props.commentOptions} ref={(commentSelection) => {this.commentSelection = commentSelection;}}/>                  
                    <TextField autoFocus required id="message" fullWidth margin="normal" helperText="介紹事件內容及期望街坊如何參與" value={this.state.text} onChange={event => this.setState({ text: event.target.value })}/>                  
                    <SelectedMenu label="" options={this.props.statusOptions} ref={(statusSelection) => {this.statusSelection = statusSelection;}}/>                  
                    <LocationButton ref={(locationButton) => {this.locationButton = locationButton;}}/>
                    <TextField id="link" className={classes.textField} value={this.state.link} onChange={event => this.setState({ link: event.target.value })}/>
                </DialogContent>  
                <DialogActions>
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
