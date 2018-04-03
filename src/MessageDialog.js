import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import MessageDetailView from './MessageDetailView';
import {getMessage} from './MessageDB';
import ShareDrawer from './ShareDrawer';
import FavoriteButton from './FavoriteButton';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  }, 
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  dialogContainer: {
    padding: '0.5rem'
  },
  dialogTitle: {
    position: 'relative',
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
  },
  root: {
     paddingRight: 0
  }
  
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class MessageDialog extends React.Component {
  constructor(props) {
      super(props);
      this.state = {open: false};
      this.message = null;                
      this.openDialog = this.openDialog.bind(this);
      this.props.openDialog(this.openDialog);  
  }

  componentDidMount() {
    if(this.props.open) {
      console.log("openDialog uuid: " + uuid);
      var uuid = this.props.uuid;
      getMessage(uuid).then((message) => {
        console.log("Message: " + message);            
        this.message = message;   
        this.setState({open: true });          
      });
    }
  }

  openDialog(){
//    console.log("openDialog new UUID: " + newUUid);
    var uuid = this.props.uuid;
    return getMessage(uuid).then((message) => {
      this.message = message;   
      this.setState({open: true });         
    });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    var user = this.props.user;
    var uuid = this.props.uuid;
    let titleHtml = null;
    let detailView = null;
    var shareUrl = window.location.protocol + "//" + window.location.hostname + "/?eventid=" + uuid;
    var title = "";
    var imageUrl = "";
    if(this.state.open) {
      var m = this.message;
      title = m.text;
      imageUrl = m.publicImageURL
      titleHtml = <Typography variant="title" color="inherit" className={classes.flex}>
            {m.text}
          </Typography>;
      detailView = <MessageDetailView message={m} user={user}/>;
    }
    return (
        <Dialog
          fullScreen
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
          transition={Transition}
          unmountOnExit
        >      
          <AppBar className={classes.dialogTitle}>
            <Toolbar className={classes.root}>
              <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              {titleHtml}

               <FavoriteButton message={m} user={user} />
               <ShareDrawer message={m}/>      
            </Toolbar>
          </AppBar>
          {detailView}
        </Dialog>
    );
  }
}

MessageDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MessageDialog);
