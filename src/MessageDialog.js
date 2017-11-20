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
import MessageExpandView from './MessageExpandView';

const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class MessageDialog extends React.Component {
    constructor(props) {
        super(props);
        this.props.open = false;
        this.state = {open: false};
        this.openDialog = this.openDialog.bind(this);
    }


    componentDidMount() {
        this.props.openDialog(this.openDialog)
    }    

  openDialog(){
    this.setState({ open: true });
  };


  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    var m = this.props.message;
    var user = this.props.user;
    var uuid = this.props.uuid;
//    this.setState({open: this.props.open});
    return (
        <Dialog
          fullScreen
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
          transition={Transition}
          unmountOnExit
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography type={"title"} color="inherit" className={classes.flex}>
                {m.text}
              </Typography>
            </Toolbar>
          </AppBar>
          <MessageDetailView message={m}/>
          <MessageExpandView message={m} uuid={uuid} user={user}/>                    
          
        </Dialog>
    );
  }
}

MessageDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MessageDialog);