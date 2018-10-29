import React, { Component } from 'react';
import uuid from 'js-uuid';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
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
import Grid from '@material-ui/core/Grid';
import ListItemText  from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import ShareDrawer from '../ShareDrawer';
import timeOffsetStringInChinese from '../TimeString';
import  {constant} from '../config/default';
import  MessageList from '../MessageList';
import TagDrawer from '../TagDrawer';
import {checkImageExists} from '../util/http';
import ReactHtmlParser from 'react-html-parser';
import {linkify} from '../util/stringHandling';
import { dropBookmark, addBookmark, updateBookmark, incBookmarkViewCount, getUserProfile} from '../UserProfile';
import {
    openSnackbar,
    checkAuthState,
    updateRecentBookmark,
    updatePublicProfileDialog,
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
        background: 'linear-gradient(to bottom, #006fbf  50%, #014880 50%)',
    },
    summaryGrid: {
        display: 'inline-grid',
        padding: '8px',
    },
    authorGrid: {
        alignItems: 'center',
        alignContent: 'center',

        padding: '8px'
    },
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
        if(this.props.bookmark !== undefined && this.props.bookmark  != null ) {
            let c = this.props.bookmark;
            title = c.title;
            messages = c.messages;
            key = c.key;
            desc = c.desc;
            uid = c.uid;
            readonly = true;
        }
        if(this.props.open !== undefined) {
            open = this.props.open;
        }
        this.onBackButtonEvent = this.onBackButtonEvent.bind(this);
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

    componentDidMount() {
        //console.log("componentDidMolunt");
        return this.getUserProfile();
      }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.bookmark !== prevProps.bookmark || this.state.uid !== prevState.uid) {
          return this.getUserProfile();
        } else {
            return;
        }
      }

    getUserProfile() {
        if(this.state.uid !== "") {
            let user = {uid: this.state.uid};
            return getUserProfile(user).then((userProfile) => {
                this.setState({userProfile: userProfile});
                return;});
        } else {
            return
        }
    }

    handleRequestOpen(evt) {
        this.lastOnPopState = window.onpopstate;
        window.onpopstate = this.onBackButtonEvent;
        evt.preventDefault();
        let title = "";
        let messages = [];
        let desc = "";
        let key = "";
        let uid = "";
        let readonly = false;
        if(this.props.bookmark  != null ) {
            let c = this.props.bookmark;
            messages = c.messages;
            key = c.key;
            title = c.title;
            desc = c.desc;
            uid = c.uid;
            readonly = true;
            const { updateRecentBookmark, recentMessage } = this.props;
            if(key  != null  && key !== "") {
              let incViewCount = false;
              // check the message viewed in this session or not.
              if(recentMessage.recentbookmarks.indexOf(key) === -1) {
                incViewCount = true;
              }
              updateRecentBookmark(uid, key, false);

              if(incViewCount) {
                let user = {uid: uid};
                incBookmarkViewCount(user, key);
              }
            }
          };

        this.setState({
            popoverOpen: true,
            title: title,
            messages: messages,
            desc: desc,
            key: key,
            uid: uid,
            readonly: readonly
        });
        window.history.pushState("", "", `/user/${uid}/${key}`)
      }

    handleRequestClose() {
        //window.history.pushState("", "", "/");
        if(this.props.closeDialog  != null ) {
            this.props.closeDialog();
        } else {
            window.onpopstate = this.lastOnPopState;
            this.setState({
               popoverOpen: false,
               userProfile: null,
               uid: ""
            });
        }
    };

    onBackButtonEvent(e) {
        e.preventDefault();
        this.handleRequestClose();
      }


    onSubmit() {
        const { user } = this.props;
        if (this.state.title === null || this.state.title.length === 0) {
            this.titleTextField.select();
            this.props.openSnackbar(constant.pleaseInputSummary, 'warning');
        } else {
            if (this.state.key !== "" && user.user.uid === this.state.uid) {
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

    handleAuthorClick() {
        const {bookmark, updatePublicProfileDialog} = this.props;
        if (bookmark.uid) {
          updatePublicProfileDialog(bookmark.uid, bookmark.uid, true)
        }
      };

    onDelete() {
      const { user } = this.props;
      if (user.user.uid === this.state.uid) {
        dropBookmark(user.user, this.state.key).then(()=> {this.props.checkAuthState();});
      }
      this.setState({popoverOpen: false});
    }

    renderReadonly() {
        let viewCountString = constant.viewCountLabel;
        const { bookmark, classes} = this.props;
        let post = '張貼';
        let timeOffset = Date.now() - bookmark.createdAt.toDate();
        let timeOffsetString = timeOffsetStringInChinese(timeOffset);
        let subheader = `於:${timeOffsetString}前${post}`;
        let photoUrl = '/images/profile_placeholder.png';
        let displayName = "";
        if(this.state.userProfile  != null  && checkImageExists(this.state.userProfile.photoURL)) {
            displayName =  this.state.userProfile.displayName;
            photoUrl = this.state.userProfile.photoURL;
        }
        let fbProfileImage = <Avatar src={photoUrl} onClick={() => this.handleAuthorClick()} />;
        if(bookmark.viewCount  != null ) {
            viewCountString += bookmark.viewCount;
        } else {
            viewCountString += 0;
        }

        return (
          <Grid container spacing={16}>
            <Grid item className={classes.authorGrid}>
              {fbProfileImage}
              <Typography color='primary' noWrap='true' >{displayName}</Typography>
              <Typography color='primary' noWrap='true' >{subheader}</Typography>
            </Grid>
            <Grid item xs className={classes.summaryGrid}>
                <Typography variant="headline">{bookmark.title}</Typography>
                <Typography variant="subheading">{viewCountString}</Typography>
            </Grid>
          </Grid>);
      }

    render() {
        const { classes, user} = this.props;
        let isRenderTagList = false;
        let addressButtonHtml = null;
        let deleteButtonHtml = null;
        let actionButtonHtml = null;
        let readonlyHtml = null;
        let titleText = constant.updateBookmarkLabel;
        let messageHtml = null;
        let icons = <PlayListPlayIcon />;

        if(this.props.bookmark  != null ) {
            let c = this.props.bookmark;
            let text = c.title;
            addressButtonHtml = <ListItem button onClick={(evt) => this.handleRequestOpen(evt)}>
                                    <ListItemIcon>
                                        {icons}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItem>
            if(this.state.messages.length !== 0) {
                messageHtml = <MessageList
                    disableLocationDrawer={true}
                    isUsePublicAddressBook={false}
                    ref={(messageList) => {this.messageList = messageList;}}
                    eventNumber={100}
                    distance={10}
                    messageIds={this.state.messages}
                />
                isRenderTagList = true;
            }
            if(user.user  != null  && user.user.uid === c.uid) {
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
        let titleEditHtml =null;
        let descHtml=null;
        if(this.state.readonly) {
            readonlyHtml = this.renderReadonly();
            titleTextHtml = constant.bookmarkTitleLabel;
            let descText = '<div>'+linkify(this.state.desc)+'</div>';
            descHtml  = ReactHtmlParser(descText);
            if(user.user && user.user.uid === this.props.bookmark.uid) {
                deleteButtonHtml = <IconButton color="contrast" onClick={() => this.setState({readonly: false})} aria-label="Close">
                                    <EditIcon />
                                </IconButton>
            }
            actionButtonHtml = <ShareDrawer bookmark={this.props.bookmark}/>
        } else {
            actionButtonHtml = <Button variant="raised" color="primary" onClick={() => this.onSubmit()}>{titleText}</Button>;
            titleEditHtml = <TextField disabled={this.state.readonly} autoFocus required inputRef={(tf) => {this.titleTextField = tf;}} id="title" fullWidth margin="normal" helperText={constant.bookmarkTitleLabel} value={this.state.title} onChange={event => this.setState({ title: event.target.value })}/>
            descHtml = <TextField disabled={this.state.readonly} required id="desc" fullWidth
                    multiline
                    rowsMax="20"
                    margin="normal" helperText={constant.descLabel} value={this.state.desc} onChange={event => this.setState({ desc: event.target.value })}/>
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
                            {readonlyHtml}
                            {titleEditHtml}
                            {descHtml}
                            <TagDrawer isRenderTagList={isRenderTagList}/>
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
    recentMessage: state.recentMessage,
  };
}

const mapDispatchToProps = (dispatch) => {
    return {
        openSnackbar:
        (message, variant) =>
          dispatch(openSnackbar(message, variant)),
        checkAuthState:
        () => dispatch(checkAuthState()),
        updateRecentBookmark:
        (uid, bookmark, open) => dispatch(updateRecentBookmark(uid, bookmark, open)),
        updatePublicProfileDialog:
        (uid, fbuid, open) => dispatch(updatePublicProfileDialog(uid, fbuid, open)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BookmarkView));
