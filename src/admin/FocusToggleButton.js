import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CheckIcon from '@material-ui/icons/Check';
import StarsIcon from '@material-ui/icons/Stars';
import { withStyles } from '@material-ui/core/styles';
import { updateFocusMessage, addFocusMessage, dropFocusMessage} from '../GlobalDB';
import {connect} from "react-redux";
import {
  checkAuthState,
  fetchConcernMessagesFromOurLand
} from '../actions';
import { constant } from '../config/default';


const styles = () => ({
  base: {
    margin: 0,
    borderRadius: 0,
    width: '64px',
    height: '64px'
  },
  on: {
    color: 'secondary',
  },
  off: {
    color: null,
  }
});

class FocusToggleButton extends Component {
  constructor(props) {
    super(props);
    this.state={open: false};
  }

  componentDidMount() {

  }

  renderFocusList() {
    const { message, ourland } = this.props;
    return ourland.globalFocusMessages.map(focusMessage => {
      let icons = null;
      if(focusMessage.messages.indexOf(message.key) != -1) {
          icons = <ListItemIcon><CheckIcon/></ListItemIcon>;
      }
      return (
        <ListItem button onClick={() => {this.toggleFocusMessage(focusMessage, message.key)}}>
          <ListItemText primary={focusMessage.title} />
            {icons}
        </ListItem>
      );
    });
  }

  toggleFocusMessage(focusMessage, messageKey) {
    const index = focusMessage.messages.indexOf(messageKey);
    if(index == -1) {
        focusMessage.messages.push(messageKey);
    } else {
        focusMessage.messages.splice(index, 1);
    }    
    updateFocusMessage(focusMessage.key, focusMessage);
    this.setState({open: false});    
  }

  render() {
    const { classes } = this.props;
    const baseClass = classes.base;
    const iconHtml = <StarsIcon/>;
    let disable = true;
    if(this.props.user != null && this.props.user.user != null) {
      disable = false;
    }
    let outputHtml = <IconButton
                        className={baseClass}
                        disabled={disable}
                        onClick={() => {this.setState({open: true})}}
                        >
                      {iconHtml}
                    </IconButton>
    let drawer = <Drawer anchor='bottom'
    open={this.state.open}
    onClose={() => {this.setState({open: false})}}
    unmountOnExit>
    <div tabIndex={0}
        role='button'
        className={classes.fullList}>
        <List>
            <Divider />
            {this.renderFocusList()}
        </List>
    </div>
</Drawer>

    return (<div>
        {outputHtml}
        {drawer}
        </div>);
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    ourland : state.ourland,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthState:
      () => dispatch(checkAuthState()),
      fetchConcernMessagesFromOurLand:
      () => dispatch(fetchConcernMessagesFromOurLand()),        
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FocusToggleButton));
