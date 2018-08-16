/*global FB*/
import React, { Component } from 'react';
import * as firebase from 'firebase';
import config, {constant, addressEnum, RoleEnum} from './config/default';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import MessageList from './MessageList';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Divider from '@material-ui/core/Divider';
import FilterBar from './FilterBar';
import {fetchMessagesBaseOnGeo, fetchReportedUrgentMessages} from './MessageDB';
import {
  toggleAddressDialog,
} from "./actions";
import {connect} from "react-redux";

function Transition(props) {
  return <Slide direction="down" {...props} />;
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

class NotificationsDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messageIds: [],
      open: false,
    };
    this.setMessage = this.setMessage.bind(this);
    this.clear = this.clear.bind(this);    
  }    

  componentDidMount() {
    if(this.props.user && this.props.user.lastLogin) {
      this.refreshMessageList();
    }
  }
 
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user != this.props.user &&  this.props.user && this.props.user.lastLogin && this.state.messageIds.length == 0) {
      this.refreshMessageList();
    } 
  }    

  refreshMessageList() {
    this.fetchMessages(); 
  }

  setMessage(val) {
    if(val == null) {
      return;
    }
    let messageIds = this.state.messageIds;
    const messageUUID = val.key;
    var index = messageIds.indexOf(messageUUID);
    if(index == -1)
    {
      messageIds.push(messageUUID);
    }
    this.setState({messageIds: messageIds});
  }

  clear() {
    //console.log("clear  message list")geocode.longitude
    this.setState({messageIds: []});
  }  


  fetchMessages() {
    this.clear();
    const { addressBook, user} = this.props;
    const lastLoginTime = user.lastLogin;
    addressBook.addresses.map((address) => {
      if(address.geolocation != null && (address.type == addressEnum.home || address.type == addressEnum.office)) {
        let distance = constant.distance;
        if(address.distance != null) {
          distance = address.distance;
        }
        if(user.userProfile.role == RoleEnum.admin) {
          distance = 100;
        }
        //console.log(address.geolocation);
        fetchMessagesBaseOnGeo(address.geolocation, distance, constant.defaultEventNumber, lastLoginTime, null, this.setMessage);
        if(user.userProfile.role == RoleEnum.admin || user.userProfile.role == RoleEnum.monitor) {
          fetchReportedUrgentMessages(this.setMessage);
        }
      }
    });      

   
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
          ref={(messageList) => {this.state.messageList = messageList;}}
          eventNumber={100}
          distance={10}
          messageIds={this.state.messageIds}
        />
      </div>
    );
  }

  
  render() {
    const { classes} = this.props;let messageHtml = null;
    if(this.state.open)  {
        messageHtml = this.renderMessages();
    }
    let output = null;
    if(this.state.messageIds.length > 0) {
      output = <span>
            <IconButton className={classes.margin} onClick={(evt) => this.handleRequestOpen(evt)}>
              <Badge badgeContent={this.state.messageIds.length} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Dialog fullScreen  open={this.state.open} onRequestClose={this.handleRequestClose} transition={Transition} unmountOnExit>
                <AppBar className={classes.appBar} >
                    <Toolbar>
                        <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>{constant.notificationLabel}</Typography> 
                    </Toolbar>
                </AppBar>
                <FilterBar disableLocationDrawer={true}/>                           
                {messageHtml}
            </Dialog>
        </span>;
    }
    return(output);
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    addressBook: state.addressBook,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleAddressDialog: flag => dispatch(toggleAddressDialog(flag)),
  }
};

NotificationsDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NotificationsDialog));
