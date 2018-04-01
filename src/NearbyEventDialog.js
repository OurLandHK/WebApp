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
import {connect} from "react-redux";
import { toggleNearbyEventDialog } from './actions';
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

class NearbyEventDialog extends React.Component {
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
    this.props.toggleNearbyEventDialog(true);
  }

  handleRequestClose = () => {
    this.props.toggleNearbyEventDialog(false);
  };

  renderMessages() {
    const { eventNumber, distance, geolocation, eventId } = this.state;
    const { classes } = this.props; 
    return (
      <div className={classes.container}>
        <MessageList
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
        image="/images/ssp.jpg"
        title={constant.nearbyEventLabel}
      >
        <div
          className={classes.mediaCredit}
        >
          Photo by Steven Wei on Unsplash
        </div>
      </CardMedia>
    );

    if(open)  {
        messageHtml = this.renderMessages();
    }
    return (
        <span>
            <Card onClick={(evt) => this.handleRequestOpen(evt)}>
                {cardImage}
                <CardContent>
                <Typography variant="headline" component="h2">
                    {constant.nearbyEventLabel}
                </Typography>
                <Typography component="p">
                    查詢現在身處位置或地址簿中1公里範圍的社區人和事
                </Typography>
                </CardContent>
            </Card>
            <Dialog fullScreen  open={open} onRequestClose={this.handleRequestClose} transition={Transition} unmountOnExit>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>{constant.nearbyEventLabel}</Typography>           
                    </Toolbar>
                    <FilterBar />           
                </AppBar>
                {messageHtml}
            </Dialog>
        </span>);
  }
}

NearbyEventDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    open: state.nearbyEventDialog.open,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleNearbyEventDialog: flag => 
      dispatch(toggleNearbyEventDialog(flag)),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(NearbyEventDialog));
