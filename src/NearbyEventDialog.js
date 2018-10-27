import React from 'react';
import {constant} from './config/default';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import Card from '@material-ui/core/Card';
import MessageList from './MessageList';
import {connect} from "react-redux";
import { fetchLocation, toggleNearbyEventDialog } from './actions';
import FilterBar from './FilterBar';
import {trackEvent} from './track';

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
      textAlign: 'center',
      color: 'white',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: '8px 4px',
      borderRadius: 0,
      border: 'none',
      margin: '1px',
      boxShadow: 'none',

      '&:hover': {
        backgroundColor: '#3f51b5'
      }
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
    card: {
      textAlign: 'center',
      boxShadow: 'none'
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

class NearbyEventDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.onBackButtonEvent = this.onBackButtonEvent.bind(this);
    this.state = {
        eventNumber: this.props.eventNumber,
        distance: this.props.distance,
        geolocation: this.props.geolocation,
        filter: null,
        titleLabel: "",
        showList: true,
      };
  }

  handleRequestOpen(evt, titleLabel, filter) {
    evt.preventDefault();
    this.lastOnPopState = window.onpopstate;
    window.onpopstate = this.onBackButtonEvent;
    console.log(filter, titleLabel);
    trackEvent('Event', titleLabel);
    this.setState({filter: filter, titleLabel: titleLabel, showList: false});
    //this.props.toggleRegionEventDialog(true);
  }

  handleRequestClose = () => { // this function is not called
    window.onpopstate = this.lastOnPopState;
    //this.props.toggleRegionEventDialog(false);
  };

  onBackButtonEvent(e) {
    console.log("onBackButtonEvent Region" + JSON.stringify(e.state));
    e.preventDefault();
    //this.handleRequestClose();
  }

  renderMessages() {
    const { eventNumber, distance, geolocation } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <MessageList
          short={true}
          isUsePublicAddressBook={true}
          ref={(messageList) => {this.messageList = messageList;}}
          eventNumber={eventNumber}
          distance={distance}
          geolocation={geolocation}
          tagFilter={this.state.filter}
          id={constant.nearbyEventLabel}
        />
      </div>
    );
  }


  render() {
    const { classes, buttons } = this.props;
    let messageHtml = null;
    let filterBar = null;
    const TotalButton = buttons.length;
    let buttonList1 = [];
    let buttonList2 = [];
    let firstLine = TotalButton/2 + TotalButton%2;
    for(let i = 0; i < TotalButton; i++) {
      let buttonHtml = <Button className={classes.button} variant="contained" size="small" aria-label={buttons[i].label}
          onClick={(evt) => this.handleRequestOpen(evt, buttons[i].label, buttons[i].value)}>
          {buttons[i].label}
          </Button>
      if(i<firstLine) {
        buttonList1.push(buttonHtml);
      } else {
        buttonList2.push(buttonHtml);
      }
    }

    if(this.state.showList)  {
      messageHtml = this.renderMessages();
      filterBar = <FilterBar isUsePublicAddressBook={true}/>;
    } else {
      this.setState({showList: true});
      //console.log('offthe List');
    }
    return (
        <span>
            <Card className={classes.card}>
                {constant.nearbyEventLabel}:查詢自己社區附近及全港社區的人和事
            </Card>
            {filterBar}
            {messageHtml}
        </span>);
  }
}

NearbyEventDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    filter : state.filter,
    buttons: state.regionEventDialog.buttons,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLocation: () => dispatch(fetchLocation()),
    toggleNearbyEventDialog: flag =>
      dispatch(toggleNearbyEventDialog(flag)),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(NearbyEventDialog));
