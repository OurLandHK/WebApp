import React, { Component } from 'react';
import uuid from 'js-uuid';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import PlayListPlayIcon from '@material-ui/icons/PlaylistPlay';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText  from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ShareDrawer from '../ShareDrawer';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import {connect} from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import  {constant, RoleEnum} from '../config/default';
import  MessageList from '../MessageList';
import { dropBookmark, addBookmark, updateBookmark} from '../UserProfile';
import {
    checkAuthState,
  } from '../actions';


const styles = theme => ({
    fab: {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed',
    },
    flex: {
        flex: 1,
    },
    dialogTitle: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
    }    
});

class BookmarkView extends Component {
    constructor(props) {
        super(props);
        let title = "";
        let messages = [];
        let desc = "";
        let key = "";   
        let uid = "";
        let readonly = false;
        let open = false;
        if(this.props.bookmark != null) {
            let c = this.props.bookmark;
            title = c.title;
            messages = c.messages;
            key = c.key;
            desc = c.desc;
            uid = c.uid;
            readonly = true;
        }        
        if(this.props.open != undefined) {
            open = this.props.open;
        }
        this.state = {
            popoverOpen: open,
            title: title,
            messages: messages,
            desc: desc,
            key: key,
            uid: uid,
            readonly: readonly,
        };
    }

    handleRequestOpen(evt) {
        evt.preventDefault();
        let title = "";
        let messages = [];
        let desc = "";
        let key = "";  
        let uid = "";
        let readonly = false;
        if(this.props.bookmark != null) {
            let c = this.props.bookmark;
            messages = c.messages;
            key = c.key;
            title = c.title;
            desc = c.desc;
            uid = c.uid;
            readonly = true;
        }  
        this.setState({
            popoverOpen: true,
            title: title,
            messages: messages,
            desc: desc,
            key: key,
            uid: uid,
            readonly: readonly
        });
      }
    
    handleRequestClose() {
        this.setState({
          popoverOpen: false,
        });
    };   

    onSubmit() {
        const { user } = this.props;
        if (this.state.title == null || this.state.title.length == 0) {
            this.titleTextField.select();
        } else {
            if (this.state.key != "" && user.user.uid == this.state.uid) {
                let bookmark = this.props.bookmark;
                bookmark.title = this.state.title;
                bookmark.messages = this.state.messages;
                bookmark.desc = this.state.desc;
                updateBookmark(user.user, bookmark.key, bookmark, true).then(()=> {this.props.checkAuthState();});
            } else {
                addBookmark(uuid.v4(), 
                user.user, 
                this.state.title,
                this.state.desc,
                this.state.messages).then(()=> {this.props.checkAuthState();});
            }       
            this.setState({popoverOpen: false});  
        }
    }

    
    onDelete() {
      const { user } = this.props;
      if (user.user.uid == this.state.uid) {         
        dropBookmark(user.user, this.state.key).then(()=> {this.props.checkAuthState();});
      }  
      this.setState({popoverOpen: false});
    }
    


    render() {
        const { classes, user } = this.props;
        let addressButtonHtml = null;
        let deleteButtonHtml = null;
        let actionButtonHtml = null;
        let titleText = constant.updateBookmarkLabel;
        let messageHtml = null;
        let icons = <PlayListPlayIcon />;
        if(this.props.bookmark != null) {
            let c = this.props.bookmark;
            let text = c.title;
            addressButtonHtml = <ListItem button onClick={(evt) => this.handleRequestOpen(evt)}>
                                    <ListItemIcon>
                                        {icons}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItem>
            if(this.state.messages.length != 0) {
                messageHtml = <MessageList
                    disableLocationDrawer={true}
                    isUsePublicAddressBook={false}
                    ref={(messageList) => {this.messageList = messageList;}}
                    eventNumber={100}
                    distance={10}
                    messageIds={this.state.messages}
                />
            }
            if(user.user != null && user.user.uid == c.uid) {
                deleteButtonHtml = <IconButton color="contrast" onClick={() => this.onDelete()} aria-label="Delete">
                                    <DeleteIcon />  
                                    </IconButton>
            }
        } else {
            titleText = constant.addBookmarkLabel;
            addressButtonHtml = 
                <ListItem button onClick={(evt) => this.handleRequestOpen(evt)}>
                    <AddIcon/>
                    <ListItemText primary={constant.addBookmarkLabel} />
                </ListItem>
        }
        let titleTextHtml = "";
        if(this.state.readonly) {
            titleTextHtml = titleText;
            if(user.user && user.user.uid == this.props.bookmark.uid) {
                deleteButtonHtml = <IconButton color="contrast" onClick={() => this.setState({readonly: false})} aria-label="Close">
                                    <EditIcon />
                                </IconButton>
            }
            actionButtonHtml = <ShareDrawer bookmark={this.props.bookmark}/>
        } else {
            actionButtonHtml = <Button variant="raised" color="primary" onClick={() => this.onSubmit()}>{titleText}</Button>;
        }
        return(<span>
                    {addressButtonHtml}
                    <Dialog  fullScreen open={this.state.popoverOpen} onClose={() => this.handleRequestClose()} aria-labelledby="form-dialog-title" unmountOnExit>
                        <AppBar className={classes.dialogTitle}>
                            <DialogActions>
                                <IconButton color="contrast" onClick={() => this.handleRequestClose()} aria-label="Close">
                                <CloseIcon />
                                </IconButton>
                                <Typography variant="title" color="inherit" className={classes.flex}>{titleTextHtml} </Typography>
                                {deleteButtonHtml}
                                {actionButtonHtml}
                            </DialogActions>
                        </AppBar>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <DialogContent>
                            <TextField disabled={this.state.readonly} autoFocus required inputRef={(tf) => {this.titleTextField = tf;}} id="title" fullWidth margin="normal" helperText={constant.bookmarkTitleLabel} value={this.state.title} onChange={event => this.setState({ title: event.target.value })}/>
                            <TextField disabled={this.state.readonly} required id="desc" fullWidth  
                                multiline
                                rowsMax="20" 
                                margin="normal" helperText={constant.descLabel} value={this.state.desc} onChange={event => this.setState({ desc: event.target.value })}/>
                            {messageHtml}
                        </DialogContent>  
                    </Dialog>
                </span>);
    }
}

BookmarkView.propTypes = {
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
        checkAuthState:
        () => dispatch(checkAuthState()),    
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BookmarkView));
