import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import SingleLineMessageList from './SingleLineMessageList';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { default as dist } from './util/Distance';

const styles = theme => ({
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '5px auto 5px'
  },
  card: {
    textAlign: 'center',
    boxShadow: 'none'
  },
  pos: {
    //    marginBottom: 12,
        color: theme.palette.text.secondary,
        fontSize: '11px',
        textOverflow: 'ellipsis'
      },  
});

class FocusMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	focusMsgIdx: null
    }
  }

  renderRandomFocusMessages() {
    const { classes } = this.props;
    const {globalFocusMessages: focusMessages} = this.props.ourland;
    if(focusMessages  != null   && focusMessages.length > 0) {
      let focusMsgIdx = this.generateFocusMessagesIndex(focusMessages.length);
      return <div className="focus-message-wrapper">
          <Typography variant="title" className={classes.title}>{focusMessages[focusMsgIdx].title}</Typography>
          <p className={classes.pos}>{focusMessages[focusMsgIdx].summary}</p>      
          <SingleLineMessageList
            ref={(messageList) => {this.messageList = messageList;}}
            messageIds={focusMessages[focusMsgIdx].messages}
          />
        </div>
    }else {
      return (null);
    }
  }

   generateFocusMessagesIndex(length) {
    // generating a random index for selecting a focus message item randomly
    // setting focusMsgIdx to state to avoid the value from being changed during re-rendering

    if(!length) return 0;
    let focusMsgIdx = null;
    if(this.state.focusMsgIdx === null) {
      focusMsgIdx = Math.floor((Math.random() * length));
      this.setState({focusMsgIdx})
      return focusMsgIdx;
    } else {
      return this.state.focusMsgIdx;
    }
  }

  renderFocusMessages() {
  	const {globalFocusMessages: focusMessages} = this.props.ourland;
  	let focusMessage = null;
  	let focusMessageHtml = null;
  	const { addressBook, classes } = this.props;

  	 // showing focus messages based on users' home address / office address within interested radius
    if(focusMessages !== undefined && focusMessages  != null   && focusMessages.length > 0 && addressBook  != null  && addressBook.addresses.length > 0) {
      // home
      var homeAddress = addressBook.addresses[0];
      var homeAddressInterestRadiusOrig = homeAddress.distance || 1;

      // office
      var officeAddress = addressBook.addresses[1];
      var officeAddressInterestRadiusOrig = officeAddress.distance || 1;

      // generating focus message html array 
      focusMessageHtml = focusMessages.map((focusMessage, focusMsgIdx) => {
        let homeAddressDistDiff = null;
        let officeAddressDistDiff = null;
        var homeAddressInterestRadius = homeAddressInterestRadiusOrig;
        if(focusMessage.radius > homeAddressInterestRadius) {
          homeAddressInterestRadius = focusMessage.radius;
        }
        var officeAddressInterestRadius = officeAddressInterestRadiusOrig;
        if(focusMessage.radius > officeAddressInterestRadius) {
          officeAddressInterestRadius = focusMessage.radius;
        }
  
        if(homeAddress.geolocation  != null ) {
          homeAddressDistDiff = dist(focusMessage.geolocation.longitude, focusMessage.geolocation.latitude, homeAddress.geolocation.longitude, homeAddress.geolocation.latitude);
        }

        if(officeAddress.geolocation) {
          officeAddressDistDiff = dist(focusMessage.geolocation.longitude, focusMessage.geolocation.latitude, officeAddress.geolocation.longitude, officeAddress.geolocation.latitude);
        }

        if((homeAddressDistDiff  != null  && homeAddressDistDiff < homeAddressInterestRadius) || (officeAddressDistDiff  != null  && officeAddressDistDiff < homeAddressInterestRadius) ) {
          return (
            <span key={focusMsgIdx} >
              <Card className={classes.card}>
              <Typography variant="title" className={classes.title}>{focusMessages[focusMsgIdx].title}</Typography>
              <p className={classes.pos}>{focusMessages[focusMsgIdx].summary}</p>
              </Card>
              <SingleLineMessageList ref={(messageList) => {this.messageList = messageList;}} messageIds={focusMessages[focusMsgIdx].messages}/>
            </span>
          ) 
        } else {
          return null;
        }
      });

      // filtering out null cases
      focusMessageHtml = focusMessageHtml.filter(x => !!x);

      if(focusMessageHtml.length > 0) {
        // generating focus message
        // if there are more than one hit, one of them will be selected randomly
        let focusMsgIdx = this.generateFocusMessagesIndex(focusMessageHtml.length);

        focusMessage = focusMessageHtml[focusMsgIdx];
      } else {
        // no nearby focusMessage within user's addresses 
        // generating one randomly from the focus message pool
        focusMessage = this.renderRandomFocusMessages();
      } 
    } else {
      // no address book for guests
      // generating one randomly from the focus message pool
      focusMessage = this.renderRandomFocusMessages();
    }

    return focusMessage;
  }

  render() {
    return this.renderFocusMessages();
/*  	
    return (
      <React.Fragment>
        {this.renderFocusMessages()}
      </React.Fragment>	
    );
*/    
  }

};


const mapStateToProps = (state, ownProps) => {
  return {
    ourland : state.ourland,
    addressBook: state.addressBook
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FocusMessage));