import React, { Component } from 'react';
import uuid from 'js-uuid';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import PlaceIcon from '@material-ui/icons/Place';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText  from '@material-ui/core/ListItemText';
import LocationButton from '../LocationButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import {connect} from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import geoString from '../GeoLocationString';
import  {constant, RoleEnum} from '../config/default';
import  MessageList from '../MessageList';
import {
    openSnackbar,
  } from '../actions';
import { updateFocusMessage, addFocusMessage, dropFocusMessage} from '../GlobalDB';


const styles = theme => ({
    fab: {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed',
    },
});

class FocusView extends Component {
    constructor(props) {
        super(props);
        let title = "";
        let messages = [];
        let streetAddress ="";
        let geolocation = null;
        let summary = "";
        let desc = "";
        let key = "";
        let radius = 1;
        if(this.props.focus  != null ) {
            let c = this.props.focus;
            if(c.geolocation  != null ) {
                geolocation = {latitude :c.geolocation.latitude,
                longitude: c.geolocation.longitude};
                streetAddress = c.streetAddress;
            }
            messages = c.messages;
            key = c.key;
            title = c.title;
            summary = c.summary;
            desc = c.desc;
            radius = c.radius;
        }
        this.state = {
            popoverOpen: false,
            title: title,
            geolocation: geolocation,
            messages: messages,
            streetAddress: streetAddress,
            summary: summary,
            desc: desc,
            radius: radius,
            key: key
        };
    }

    handleRequestOpen(evt) {
        evt.preventDefault();
        let title = "";
        let messages = [];
        let geolocation = null;
        let streetAddress = "";
        let summary = "";
        let desc = "";
        let key = "";
        let radius = 1;
        if(this.props.focus  != null ) {
            let c = this.props.focus;
            if(c.geolocation  != null ) {
                geolocation = {latitude :c.geolocation.latitude,
                longitude: c.geolocation.longitude};
                streetAddress = c.streetAddress;
            }
            messages = c.messages;
            key = c.key;
            title = c.title;
            summary = c.summary;
            desc = c.desc;
            radius = c.radius;
        }
        this.setState({
            popoverOpen: true,
            title: title,
            geolocation: geolocation,
            streetAddress: streetAddress,
            messages: messages,
            summary: summary,
            desc: desc,
            radius: radius,
            key: key
        });
      }

    handleRequestClose() {
        this.setState({
          popoverOpen: false,
        });
    };

    locationButtonSubmit = (geolocation, streetAddress) => {
        this.setState({
            geolocation: geolocation,
            streetAddress: streetAddress,
        });
    };

    onSubmit() {
        const { user } = this.props;
        if (user.userProfile.role === RoleEnum.admin || user.userProfile.role === RoleEnum.monitor) {
          if (this.state.key !== "") {
              let focusMessage = {
                title: this.state.title,
                geolocation: this.state.geolocation,
                streetAddress:this.state.streetAddress,
                messages: this.state.messages,
                summary: this.state.summary,
                desc: this.state.desc,
                radius: this.state.radius,
                key: this.state.key
              }
              updateFocusMessage(this.state.key, focusMessage);
          } else {
              addFocusMessage(uuid.v4(),
                this.state.title,
                this.state.geolocation,
                this.state.streetAddress,
                this.state.radius,
                this.state.summary,
                this.state.desc,
                this.state.messages
            )
          }
        }

        this.setState({popoverOpen: false});
    }


    onDelete() {
      const { user } = this.props;
      if (user.userProfile.role === RoleEnum.admin || user.userProfile.role === RoleEnum.monitor) {
        dropFocusMessage(this.state.key)
      }
      this.setState({popoverOpen: false});
    }



    render() {
        const { classes} = this.props;
        let addressButtonHtml = null;
        let titleText = constant.updateFocusMessagesLabel;
        let messageHtml = null;
        let geolocation = null;
        let streetAddress = null;
        let icons = <PlaceIcon />;
        let disableValue = true;
        if(this.props.focus  != null ) {
            disableValue = false;
            let c = this.props.focus;
            let text = c.title;
            let  locationString = constant.addressNotSet;
            if(c.geolocation  != null ) {
                streetAddress = c.streetAddress;
                geolocation = {latitude :c.geolocation.latitude,
                    longitude: c.geolocation.longitude};
                if(c.streetAddress  != null ) {
                    locationString =  c.streetAddress + " (" + geoString(c.geolocation.latitude, c.geolocation.longitude) + ")";
                } else {
                    locationString = "近" + geoString(c.geolocation.latitude, c.geolocation.longitude);
                }
            }
            addressButtonHtml = <ListItem button onClick={(evt) => this.handleRequestOpen(evt)}>
                                    <ListItemIcon>
                                        {icons}
                                    </ListItemIcon>
                                    <ListItemText primary={text} secondary={locationString} />
                                </ListItem>
            if(this.state.messages.length !== 0) {
                messageHtml = <MessageList
                    disableLocationDrawer={true}
                    isUsePublicAddressBook={false}
                    ref={(messageList) => {this.messageList = messageList;}}
                    eventNumber={100}
                    distance={10}
                    messageIds={this.state.messages}
                />
            }
        } else {
            titleText = constant.addFocusMessagesLabel;
            addressButtonHtml = <Button variant="fab" color="primary" className={classes.fab} onClick={(evt) => this.handleRequestOpen(evt)}>
                                    <AddIcon />
                                </Button>
        }
        return(<span>
                    {addressButtonHtml}
                    <Dialog  fullScreen open={this.state.popoverOpen} onClose={() => this.handleRequestClose()} aria-labelledby="form-dialog-title" unmountOnExit>
                        <DialogTitle id="form-dialog-title">{titleText}</DialogTitle>
                        <DialogContent>
                            {icons}
                            <TextField autoFocus required id="title" fullWidth margin="normal" helperText={constant.focusTitleLabel} value={this.state.title} onChange={event => this.setState({ title: event.target.value })}/>
                            <LocationButton autoFocus geolocation={geolocation} streetAddress={streetAddress} ref={(locationButton) => {this.locationButton = locationButton;}} onSubmit={this.locationButtonSubmit}/>
                            <TextField autoFocus required id="radius" margin="normal" type="number" helperText={constant.radiusLabel} value={this.state.radius} onChange={event => this.setState({ radius: event.target.value })}/>
                            <TextField autoFocus required id="summary" fullWidth margin="normal" helperText={constant.focusSummaryLabel} value={this.state.summary} onChange={event => this.setState({ summary: event.target.value })}/>
                            <TextField autoFocus required id="desc" fullWidth
                                multiline
                                rowsMax="20"
                                margin="normal" helperText={constant.descLabel} value={this.state.desc} onChange={event => this.setState({ desc: event.target.value })}/>
                            {messageHtml}
                        </DialogContent>
                        <DialogActions>
                            <Button disabled={disableValue} color="secondary" onClick={() => this.onDelete()} >刪除</Button>
                            <Button color="primary" onClick={() => this.handleRequestClose()} >取消</Button>
                            <Button color="primary" onClick={() => this.onSubmit()}>提交</Button>
                        </DialogActions>
                    </Dialog>
                </span>);
    }
}

FocusView.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
  };
}

const mapDispatchToProps = (dispatch) => {
    return {
        openSnackbar: 
        (message, variant) => 
          dispatch(openSnackbar(message, variant)),           
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FocusView));
