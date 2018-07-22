/*global FB*/
import React, { Component } from 'react';
import config, {constant} from './config/default';
import Dialog from '@material-ui/core/Dialog';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
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
    console.log(filter, titleLabel)
    this.setState({filter: filter, titleLabel: titleLabel});
    this.props.toggleRegionEventDialog(true);
  }

  handleRequestClose = () => { // this function is not called
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
          tagFilter={this.state.filter}
        />
      </div>
    );
  }


  render() {
    const { classes, open, buttons } = this.props;
    let messageHtml = null;
    const buttonList = buttons.map(buttonDetail => {
      //      return <Button  variant="outlined" color="primary" onClick={(evt) => this.handleRequestOpen(evt, buttonDetail.value)}>{buttonDetail.label}</Button>;
              return <Chip
                avatar={
                  buttonDetail.avatar
                }
                key={buttonDetail.label}
                label={buttonDetail.label}
                onClick={(evt) => this.handleRequestOpen(evt, buttonDetail.label, buttonDetail.value)}
                className={classes.chip}
              />
          });
    const cardImage = (
      <CardMedia
        className={classes.media}
        image="/images/fromPeak.jpg"
        title={constant.regionEventLabel}
      >
        <br/>
        {buttonList}
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
                    {constant.regionEventLabel}
                </Typography>
                {cardImage}
                <CardContent>
                查詢現在身處位置或十八社區的人和事
                </CardContent>
            </Card>
            <Dialog fullScreen  open={open} >
                <AppBar className={classes.appBar} >
                    <Toolbar>
                        <IconButton onClick={this.handleRequestClose} aria-label="Close">
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
