
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import PlayListPlayIcon from '@material-ui/icons/PlaylistPlay';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText  from '@material-ui/core/ListItemText';
import {connect} from "react-redux";
import config, {constant} from '../config/default';
import FocusList from './FocusList';
import FocusView from './FocusView';

function Transition(props) {
  return <Slide direction="left" {...props} />;
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

class FocusDialog extends React.Component {
  constructor(props) {
//    console.log("createEventListDialog");
    super(props);
    this.state = {
      open: false,
    };
  }

  handleRequestOpen(evt) {
    evt.preventDefault();
    this.setState({open: true});
  }

  handleRequestClose = () => {
    this.setState({open: false});
  };

  renderMessages() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <FocusList/>
      </div>
    );
  }


  render() {
    const { classes} = this.props;let messageHtml = null;let buttonHtml = null;
    let titleText = constant.focusMessagesLabel;
    let open = this.state.open; 
    if(open)  {
        messageHtml = this.renderMessages();
    }
    if(!this.invisible) {
      buttonHtml = <ListItem button onClick={(evt) => this.handleRequestOpen(evt)}>
                      <ListItemIcon>
                        <PlayListPlayIcon/>
                          </ListItemIcon>
                        <ListItemText primary={titleText} />
                      </ListItem>;
    }
    return (
        <span>
            {buttonHtml}
            <Dialog fullScreen  open={open} onRequestClose={this.handleRequestClose} transition={Transition} unmountOnExit>
                <AppBar className={classes.appBar} >
                    <Toolbar>
                        <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>{titleText}</Typography>
                    </Toolbar>
                </AppBar>
                {messageHtml}
                <FocusView/>
            </Dialog>
        </span>);
  }
}

FocusDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FocusDialog));
