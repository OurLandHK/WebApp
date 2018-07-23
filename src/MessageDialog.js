import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { constant, happyAndSadEnum } from './config/default';
import DeleteIcon from '@material-ui/icons/Delete';
import Slide from '@material-ui/core/Slide';
import MessageDetailView from './MessageDetailView';
import {getMessage, dropMessage, getHappyAndSad} from './MessageDB';
import ShareDrawer from './ShareDrawer';
import {
  checkAuthState,
} from './actions';
import {connect} from 'react-redux';

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
      this.happyAndSad = happyAndSadEnum.nothing; // (1 = happy, -1 = sad)                
      this.openDialog = this.openDialog.bind(this);
      this.props.openDialog(this.openDialog);  
  }

  componentDidMount() {
    if(this.props.open) {
      var uuid = this.props.uuid;
      console.log("openDialog uuid: " + uuid);
      return getMessage(uuid).then((message) => {
        console.log("Message: " + message);            
        this.message = message;   

        if(this.props.user != null && this.props.user.user) {
          // get sad and happy inital value
          return getHappyAndSad(uuid, this.props.user.user).then((data) => {
            console.log("Data: " + data);
            if(data != null) {
              this.happyAndSad = data.happyAndSad;
            }
            this.setState({open: true }); 
          });
        } else {
          this.setState({open: true });   
        }       
      });
    }
  }

  openDialog(){
    var uuid = this.props.uuid;
    return getMessage(uuid).then((message) => {
      this.message = message;   
      if(this.props.user != null && this.props.user.user) {
        // get sad and happy inital value
        return getHappyAndSad(uuid, this.props.user.user).then((data) => {
          console.log("Data: " + data);
          if(data != null) {
            this.happyAndSad = data;
          }
          this.setState({open: true }); 
        });
      } else {
        this.setState({open: true });   
      }        
    });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  handleRequestDelete = () => {
    return dropMessage(this.props.uuid).then((value) => {
      this.setState({ open: false });
    });
  };

  render() {
    const { classes } = this.props;
    var user = null;
    var uuid = this.props.uuid;
    let titleHtml = null;
    let detailView = null;
    let deleteButton = null;
    let shareUrl = window.location.protocol + "//" + window.location.hostname + "/?eventid=" + uuid;
    let title = "";
    let imageUrl = "";
    let m = this.message;
    const handleRequestClose = this.props.closeDialog || this.handleRequestClose
    if(this.state.open) {
      title = m.text;
      imageUrl = m.publicImageURL
      titleHtml = <Typography variant="title" color="inherit" className={classes.flex}>
            {constant.messageDialogLabel}
          </Typography>;
      var now = Date.now();
      var nowDateTime = new Date(now);
      if(this.props.user != null && this.props.user.user != null) {
        user = this.props.user.user;
        // 10 minutes
        let eventCreateTimeDiff = 0;
        try {
          eventCreateTimeDiff = nowDateTime - m.createdAt.toDate();
        } catch(error) {
          eventCreateTimeDiff = nowDateTime - m.createdAt;
        };
        console.log("User id: " + user.uid + " " + m.uid + " " + eventCreateTimeDiff  )
        if(user.uid == m.uid && ( eventCreateTimeDiff < (10 * 60 * 1000))) {
          deleteButton = <IconButton color="contrast" onClick={this.handleRequestDelete} aria-label="Close">
                            <DeleteIcon />
                          </IconButton>
        }
      }
      detailView = <MessageDetailView message={m}  happyAndSad={this.happyAndSad}/>;

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
              <IconButton color="contrast" onClick={handleRequestClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              {titleHtml}
              {deleteButton}
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

const mapStateToProps = (state, ownProps) => {
  return {
    user          :   state.user,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
      checkAuthState:
          () => 
              dispatch(checkAuthState()),   
  }
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(MessageDialog));
