/*global FB*/
import React, { Component } from 'react';
import * as firebase from 'firebase';
import config, {constant} from './config/default';
import Button from 'material-ui/Button';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import MessageList from './MessageList';
import InboxIcon from 'material-ui-icons/Inbox';
import Divider from 'material-ui/Divider';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import FilterBar from './FilterBar';

function Transition(props) {
  return <Slide direction="right" {...props} />;
}


const styles = {
    appBar: {
      position: 'relative',
    },
    flex: {
      flex: 1,
    },
    container: {
       overflowY: 'auto'
    },
    media: {
      color: '#fff',
      position: 'relative',
      height: '10rem',
    },
    mediaCredit: {
      position:'absolute',
      bottom:'0',
      right:'0',
      fontSize:'0.5rem',
    }
  };

class EventListDialog extends React.Component {
  constructor(props) {
//    console.log("createEventListDialog");
    super(props);
    var messageIds = [];
    if(this.props.messageIds != null) {  
      messageIds = this.props.messageIds;
    }
    var title = "EventList";
    if(this.props.title != undefined) {
      title = this.props.title;
    }    
    this.state = {
      messageIds: messageIds,
      title: title,
      open: false,
    };
  }    

  handleRequestOpen(evt) {
    evt.preventDefault();
    if(this.state.messageIds.length > 0) {
        this.setState({open: true});
    }
  }

  handleRequestClose = () => {
    this.setState({open: false});
  };

  renderMessages() {
    const { classes } = this.props; 
    return (
      <div className={classes.container}>
        <MessageList
          ref={(messageList) => {this.messageList = messageList;}}
          eventNumber={100}
          distance={10}
          messageIds={this.state.messageIds}
        />
      </div>
    );
  }

  
  render() {
    const { classes} = this.props;let messageHtml = null;
    let titleText = this.state.title + ": " + this.state.messageIds.length;
    if(this.state.open)  {
        messageHtml = this.renderMessages();
    }
    return (
        <span>
            <ListItem button onClick={(evt) => this.handleRequestOpen(evt)}>
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={titleText} />
            </ListItem>  
            <Dialog fullScreen  open={this.state.open} onRequestClose={this.handleRequestClose} transition={Transition} unmountOnExit>
                <AppBar className={classes.appBar} >
                    <Toolbar>
                        <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>{this.state.title}</Typography> 
                    </Toolbar>
                    <FilterBar disableLocationDrawer={true}/>           
                </AppBar>
                {messageHtml}
            </Dialog>
        </span>);
  }
}

EventListDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default (withStyles(styles)(EventListDialog));
