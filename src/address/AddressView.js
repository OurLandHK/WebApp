import React, { Component } from 'react';
import * as firebase from 'firebase';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import PlaceIcon from '@material-ui/icons/Place';
import WorkIcon from '@material-ui/icons/Work';
import HomeIcon from '@material-ui/icons/Home';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText  from '@material-ui/core/ListItemText';
import LocationButton from '../LocationButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import {connect} from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import timeOffsetStringInChinese from '../TimeString';
import geoString from '../GeoLocationString';
import { deleteAddress, upsertAddress } from '../actions';
import  {constant, addressEnum} from '../config/default';


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

class AddressView extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        var text = "";
        var geolocation = null;
        var streetAddress = null;
        var type = addressEnum.other;
        var distance = 1;
        if(this.props.address != null) {
            var c = this.props.address;
            text = c.text;
            if(c.geolocation != null) {
                geolocation = {latitude :c.geolocation.latitude,
                longitude: c.geolocation.longitude};
            }
            streetAddress = c.streetAddress;
            type = c.type;
            if(c.distance != null) {
                distance = c.distance;
            }
        }

        this.state = {
            popoverOpen: false,
            text: text,
            geolocation: geolocation,
            streetAddress: streetAddress,
            distance: distance,
            type: type
        };
    }

     handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
      };


    handleRequestOpen(evt, idx) {
        evt.preventDefault();
        var text = "";
        var geolocation = null;
        var streetAddress = null;
        var type = addressEnum.other;
        var distance = constant.distance;

        if(this.props.address != null) {
            var c = this.props.address;
            text = c.text;
            if(c.geolocation != null) {
                geolocation = {latitude :c.geolocation.latitude,
                                longitude: c.geolocation.longitude};
            }
            streetAddress = c.streetAddress;
            type = c.type;
            if(c.distance != null) {
                distance = c.distance;
            }
        }

        this.setState({
            popoverOpen: true,
            text: text,
            geolocation: geolocation,
            streetAddress: streetAddress,
            distance: distance,
            type: type,
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
        if (user.user) {
          var key = null;
          if (this.props.address != null) {
              key = this.props.address.id;
          }
          console.log("addressbook submit" + this.state.streetAddress);
          this.props.upsertAddress(user.user, key, this.state.type, this.state.text, this.state.geolocation, this.state.streetAddress, this.state.distance);
          this.setState({popoverOpen: false});

        }
    }


    onDelete() {
      const { user } = this.props;
      if (user.user) {
        var key = null;
        if (this.props.address != null) {
            key = this.props.address.id;
        }
        if (key == null)
          return;
        this.props.deleteAddress(user.user, key);
      }
      this.setState({popoverOpen: false});
    }



    render() {
        const { classes, theme, idx } = this.props;
        let addressButtonHtml = null;
        let titleText = constant.updateAddressLabel;
        let geolocation = null;
        let streetAddress = null;
        let type = addressEnum.other;
        let icons = <PlaceIcon />;
        let disableValue = false;
        if(this.props.address != null) {
            var c = this.props.address;
            var text = c.text;
            streetAddress = c.streetAddress;
            type = c.type;
            var locationString = constant.addressNotSet;
            switch(type) {
                case addressEnum.home:
                    icons = <HomeIcon />;
                    disableValue = true;
                    break;
                case addressEnum.office:
                    icons = <WorkIcon />;
                    disableValue = true;
                    break;
            }
            if(c.geolocation != null) {
                geolocation = {latitude :c.geolocation.latitude,
                    longitude: c.geolocation.longitude};
                if(c.streetAddress != null) {
                    locationString =  c.streetAddress + " (" + geoString(c.geolocation.latitude, c.geolocation.longitude) + ")";
                } else {
                    locationString = "近" + geoString(c.geolocation.latitude, c.geolocation.longitude);
                }
            }
            addressButtonHtml = <ListItem button onClick={(evt) => this.handleRequestOpen(evt, idx)}>
                                    <ListItemIcon>
                                        {icons}
                                    </ListItemIcon>
                                    <ListItemText primary={text} secondary={locationString} />
                                </ListItem>
        } else {
            titleText = constant.addAddressLabel;
            addressButtonHtml = <Button variant="fab" color="primary" className={classes.fab} onClick={(evt) => this.handleRequestOpen(evt, idx)}>
                                    <AddIcon />
                                </Button>
        }
        return(<span>
                    {addressButtonHtml}
                    <Dialog open={this.state.popoverOpen} onClose={() => this.handleRequestClose()} aria-labelledby="form-dialog-title" unmountOnExit>
                        <DialogTitle id="form-dialog-title">{titleText}</DialogTitle>
                        <DialogContent>
                            {icons}
                            <TextField disabled={disableValue} autoFocus required id="message" fullWidth margin="normal" helperText="名稱" value={this.state.text} onChange={event => this.setState({ text: event.target.value })}/>
                            <LocationButton autoFocus geolocation={geolocation} streetAddress={streetAddress} ref={(locationButton) => {this.locationButton = locationButton;}} onSubmit={this.locationButtonSubmit}/>
                            
                            <FormHelperText>{constant.interestedRadius}</FormHelperText>
                            <Select
                                value={this.state.distance}
                                onChange={this.handleChange}
                                inputProps={{
                                  name: 'distance',
                                  id: 'interestedRadius',
                                }}
                              >
                                <MenuItem value={1}>1 {constant.kilometre}</MenuItem>
                                <MenuItem value={2}>2 {constant.kilometre}</MenuItem>
                                <MenuItem value={3}>3 {constant.kilometre}</MenuItem>
                              </Select>
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

AddressView.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    filter : state.filter,
    geolocation: state.geolocation,
    user: state.user,
    addressbook: state.addressBook
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteAddress:
      (user, key) =>
        dispatch(deleteAddress(user, key)),
    upsertAddress:
      (user, key, type, text, geolocation, streetAddress, interestedRadius) =>
        dispatch(upsertAddress(user, key, type, text, geolocation, streetAddress, interestedRadius)),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddressView));
