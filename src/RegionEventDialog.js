/*global FB*/
import React, { Component } from 'react';
import config, {constant} from './config/default';
import Dialog from '@material-ui/core/Dialog';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import MessageList from './MessageList';
import {connect} from "react-redux";
import { toggleRegionEventDialog } from './actions';
import FilterBar from './FilterBar';
import {trackEvent} from './track';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}


const styles = theme =>  ({
    appBar: {
      position: 'relative',
    },
    flex: {
      flex: 1,
    },
    buttonGird: {
      justify: 'center',
      flexGrow: 1
    },
    button: {
      flex: 1,
      padding: theme.spacing.unit,
      textAlign: 'center',
      color: theme.palette.text.secondary,
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
    title: {
      fontWeight: 'bold',
      textAlign: 'center',
      margin: '40px auto 10px'
    }
  });

class RegionEventDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.onBackButtonEvent = this.onBackButtonEvent.bind(this);
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
    this.lastOnPopState = window.onpopstate;
    window.onpopstate = this.onBackButtonEvent;
    console.log(filter, titleLabel);
    trackEvent('Event', titleLabel);
    this.setState({filter: filter, titleLabel: titleLabel});
    this.props.toggleRegionEventDialog(true);
  }

  handleRequestClose = () => { // this function is not called
    window.onpopstate = this.lastOnPopState;
    this.props.toggleRegionEventDialog(false);
  };

  onBackButtonEvent(e) {
    console.log("onBackButtonEvent Region" + JSON.stringify(e.state));
    e.preventDefault();
    this.handleRequestClose();
  }

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
          tagFilter={this.state.filter}
        />
      </div>
    );
  }


  render() {
    const { classes, open, buttons } = this.props;
    let messageHtml = null;
    const TotalButton = buttons.length;
    let buttonList1 = [];
    let buttonList2 = [];
    let firstLine = TotalButton/2 + TotalButton%2;
    for(let i = 0; i < TotalButton; i++) {
      let buttonHtml = <Button  className={classes.button} variant="contained" size="small" aria-label={buttons[i].label}
          onClick={(evt) => this.handleRequestOpen(evt, buttons[i].label, buttons[i].value)}>
          {buttons[i].label}
          </Button>
      if(i<firstLine) {
        buttonList1.push(buttonHtml);
      } else {
        buttonList2.push(buttonHtml);
      }
    } 
      //      return <Button  variant="outlined" color="primary" onClick={(evt) => this.handleRequestOpen(evt, buttonDetail.value)}>{buttonDetail.label}</Button>;
    const cardImage = (
      <CardMedia
        className={classes.media}
        image="/images/fromPeak.jpg"
        title={constant.regionEventLabel}
      >
        <br/>
        <Grid container >
          <Grid container className={classes.buttonGird}>
            {buttonList1}
          </Grid>
          <Grid container className={classes.buttonGird}>
            {buttonList2}
          </Grid>
        </Grid>
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
            <Card>
                <Typography variant="headline" component="h2" className={classes.title}>
                    {constant.nearbyEventLabel}
                </Typography>
                {cardImage}
                <CardContent>
                查詢自己社區附近及全港社區的人和事
                </CardContent>
            </Card>
            <Dialog fullScreen  open={open} >
                <AppBar className={classes.appBar} >
                    <Toolbar>
                        <IconButton onClick={this.handleRequestClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>{constant.nearbyEventLabel} - {this.state.titleLabel}</Typography>
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
    buttons: state.regionEventDialog.buttons,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleRegionEventDialog: flag =>
      dispatch(toggleRegionEventDialog(flag)),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RegionEventDialog));
