import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import LocationButton from '../LocationButton';
import Dialog, { 
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import timeOffsetStringInChinese from '../TimeString';
import { withStyles } from 'material-ui/styles';
import PlaceIcon from 'material-ui-icons/Place';
import geoString from '../GeoLocationString';
import  {constant} from '../config/default';


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
        var text = "";
        var geolocation = null;
        var streetAddress = null;        
        if(this.props.addressRef != null) {
            var c = this.props.addressRef.data();
            text = c.text;
            geolocation = c.geolocation;
            streetAddress = c.streetAddress;
        }        
        this.state = {
            popoverOpen: false,
            text: text,
            geolocation: geolocation,
            streetAddress: streetAddress
        };
        console.log("text " + text + " " + this.state.text);
    }

    handleRequestOpen(evt) {
        evt.preventDefault();
        var text = "";
        var geolocation = null;
        var streetAddress = null;        
        if(this.props.addressRef != null) {
            console.log("AddressRef: " + this.props.addressRef);
            var c = this.props.addressRef.data();
            text = c.text;
            geolocation = c.geolocation;
            streetAddress = c.streetAddress;
        }        
        this.setState({
            popoverOpen: true,
            text: {text},
            geolocation: {geolocation},
            streetAddress: {streetAddress}
        });
      }
    
    handleRequestClose() {
        this.setState({
          popoverOpen: false,
        });
    }; 
    
    onSubmit() {
        var auth = firebase.auth();
        auth.onAuthStateChanged((user) => {
            if (this.props.addressRef == null) {
                //add Address
                this.setState({popoverOpen: false});
            }
            this.setState({popoverOpen: false});
            return null;
        });
    }
    


    render() {
        const { classes, theme } = this.props;
        let addressButtonHtml = null;
        let titleText = constant.updateAddressLabel;
        let geolocation = null;
        let streetAddress = null;        
        if(this.props.addressRef != null) {
            var c = this.props.addressRef.data();
            var text = c.text;
            geolocation = c.geolocation;
            streetAddress = c.streetAddress;            
            var locationString = constant.addressNotSet;
            if(c.geolocation != null) {
                if(c.streetAddress != null) {
                    locationString =  c.streetAddress + " (" + geoString(c.geolocation.latitude, c.geolocation.longitude) + ")";
                } else {
                    locationString = "近" + geoString(c.geolocation.latitude, c.geolocation.longitude);      
                } 
            }
            addressButtonHtml = <ListItem button onClick={(evt) => this.handleRequestOpen(evt)}>
                                    <ListItemIcon>
                                        <PlaceIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={text} secondary={locationString} />
                                </ListItem>
        } else {
            titleText = constant.addAddressLabel;
            addressButtonHtml = <Button variant="fab" color="primary" className={classes.fab} raised={true} onClick={(evt) => this.handleRequestOpen(evt)}>
                                    <AddIcon />
                                </Button>
        }
        return(<span>
                    {addressButtonHtml}
                    <Dialog open={this.state.popoverOpen} onClose={() => this.handleRequestClose()} aria-labelledby="form-dialog-title" unmountOnExit>
                        <DialogTitle id="form-dialog-title">{titleText}</DialogTitle>
                        <DialogContent>
                            <TextField autoFocus required id="message" fullWidth margin="normal" helperText="名稱" value={this.state.text} onChange={event => this.setState({ text: event.target.value })}/>
                            <LocationButton autoFocus geolocation={geolocation} streetAddress={streetAddress} ref={(locationButton) => {this.locationButton = locationButton;}}/>                   
                        </DialogContent>  
                        <DialogActions>
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
  
export default withStyles(styles, { withTheme: true })(AddressView);
