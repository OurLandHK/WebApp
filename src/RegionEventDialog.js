/*global FB*/
import React, { Component } from 'react';
import * as firebase from 'firebase';
import config, {constant} from './config/default';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import MessageList from './MessageList';
import {connect} from "react-redux";
import { toggleRegionEventDialog } from './actions';
import FilterBar from './FilterBar';

function Transition(props) {
  return <Slide direction="up" {...props} />;
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

class RegionEventDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        eventNumber: this.props.eventNumber,
        distance: this.props.distance, 
        geolocation: this.props.geolocation
      };
  }    

  handleRequestOpen(evt) {
    evt.preventDefault();
    this.props.toggleRegionEventDialog(true);
  }

  handleRequestClose = () => {
    this.props.toggleRegionEventDialog(false);
  };

  renderMessages() {
    const { eventNumber, distance, geolocation, eventId } = this.state;
    const { classes } = this.props; 
    return (
      <div className={classes.container}>
        <MessageList
          isUsePublicAddressBook={true}
          ref={(messageList) => {this.messageList = messageList;}}
          eventNumber={eventNumber}
          distance={distance}
          geolocation={geolocation}
        />
      </div>
    );
  }

  
  render() {
    const { classes, open } = this.props;let messageHtml = null;

    const cardImage = (
      <CardMedia
        className={classes.media}
        image="/images/fromPeak.jpg"
        title={constant.regionEventLabel}
      >
        <div
          className={classes.mediaCredit}
        >

        </div>
      </CardMedia>
    );

    if(open)  {
        messageHtml = this.renderMessages();
    }
    return (
        <span>
            <br/>
            <Card onClick={(evt) => this.handleRequestOpen(evt)}>
                {cardImage}
                <CardContent>
                <Typography variant="headline" component="h2">
                    {constant.regionEventLabel}
                </Typography>
                <Typography component="p">
                    查詢現在身處位置或十八社區的人和事
                </Typography>
                </CardContent>
            </Card>
            <Dialog fullScreen  open={open} onRequestClose={this.handleRequestClose} transition={Transition} unmountOnExit>
                <AppBar className={classes.appBar} >
                    <Toolbar>
                        <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>{constant.regionEventLabel}</Typography>           
                    </Toolbar>      
                </AppBar>
                <FilterBar isUsePublicAddressBook={true}/>     
                {messageHtml}
            </Dialog>
        </span>);
  }
}

RegionEventDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    open: state.regionEventDialog.open,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleRegionEventDialog: flag => 
      dispatch(toggleRegionEventDialog(flag)),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RegionEventDialog));
