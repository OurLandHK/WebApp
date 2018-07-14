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
import { toggleNearbyEventDialog } from './actions';
import Chip from '@material-ui/core/Chip';
import FilterBar from './FilterBar';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}


const styles = theme => ({
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
  },
  chip: {
    margin: theme.spacing.unit / 2,
  },  
});

class NearbyEventDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        eventNumber: this.props.eventNumber,
        distance: this.props.distance, 
        geolocation: this.props.geolocation,
        filter: null,
        titleLabel: ""
      };
  }    

  handleRequestOpen(evt, titleLabel, filter) {
    evt.preventDefault();
    this.setState({filter: filter, titleLabel: titleLabel});
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
          tagFilter={this.state.filter}
        />
      </div>
    );
  }

  
  render() {
    const { classes, open, buttons } = this.props;
    let messageHtml = null;

    if(open)  {
        messageHtml = this.renderMessages();
    }
    return (
        <span>
            <Card onClick={(evt) => this.handleRequestOpen(evt, buttons[0].label, buttons[0].value)}>
              <Typography variant="headline" component="h2">{constant.nearbyEventLabel}</Typography>
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
              <Typography component="p">
                  查詢附近1公里的社區人和事
              </Typography>              
            </Card>
            <Dialog fullScreen  open={open} onRequestClose={this.handleRequestClose} transition={Transition} unmountOnExit>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>{`${constant.nearbyEventLabel} ${this.state.titleLabel}`}</Typography>           
                    </Toolbar>      
                </AppBar>
                <FilterBar />     
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
    buttons: state.nearbyEventDialog.buttons,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleNearbyEventDialog: flag => 
      dispatch(toggleNearbyEventDialog(flag)),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(NearbyEventDialog));
