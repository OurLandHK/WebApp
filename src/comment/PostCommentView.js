import React, { Component } from 'react';
import {connect} from 'react-redux';
import uuid from 'js-uuid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import LocationButton from '../LocationButton';
import SelectedMenu from '../SelectedMenu';
import {constant, RoleEnum} from '../config/default';
import {addComment} from '../MessageDB';
import UploadImageButton from '../UploadImageButton';
import IntegrationReactSelect from '../IntegrationReactSelect';
import {
  openSnackbar,
  checkAuthState,
} from '../actions';
import SignInButton from '../SignInButton'
import MessageDetailViewImage from '../MessageDetailViewImage';

const styles = theme => ({
  fab: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
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
    background: 'linear-gradient(to bottom, #006fbf  50%, #014880 50%)',
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class PostCommentView extends Component {
  constructor(props) {
    super(props);
    let tags = (this.props.message.tag) ? this.props.message.tag.join() : '';
    let imagePath = this.props.messageUUID + '/' + uuid.v4();
    let galleryEntry = {imageURL: null,
                        publicImageURL: null,
                        thumbnailImageURL: null,
                        thumbnailPublicImageURL: null};
    this.state = {popoverOpen: false, buttonShow: false,
      // comment
      commentSelection: constant.commentOptions[0],
      text: "",
      galleryEntry: galleryEntry,
      imagePath: imagePath,
      geolocation: null,
      streetAddress: null,
      changeStatus: constant.statusOptions[0],
      createdAt: null,
      link: null,
      tags: tags};
    this.handleTagChange = this.handleTagChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.uploadFinish = this.uploadFinish.bind(this);
    this.handleThumbnailSelect = this.handleThumbnailSelect.bind(this);
  }

  componentDidMount() {
    if (this.props.user != null  && this.props.user.user != null) {
      //console.log("DidMount Enable Post");
      this.setState({buttonShow: true});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user !== this.props.user && this.props.user  != null) {
      //console.log("DidUpdate Enable Post");
      const {user} = this.props.user;
      (user)
        ?
          this.setState({buttonShow: true})
        :
          this.setState({buttonShow: false});
    }
  }

  handleRequestOpen(evt) {
    evt.preventDefault();
    var tags = '';
    if(this.props.message.tag) {
      tags = this.props.message.tag.join();
      console.log(this.props.message.tag + " ->   " + tags);
    }
    let imagePath = this.props.messageUUID + '/' + uuid.v4();
    //console.log("Request for open " + this.state.popoverOpen);
    let galleryEntry = {imageURL: null,
      publicImageURL: null,
      thumbnailImageURL: null,
      thumbnailPublicImageURL: null};
    this.setState({
     // Comment
        commentSelection: constant.commentOptions[0],
        text: "",
        galleryEntry: galleryEntry,
        imagePath: imagePath,
        geolocation: null,
        streetAddress: null,
        changeStatus: constant.statusOptions[0],
        createdAt: null,
        hide: false,
        link: null,
        tags: tags,
        popoverOpen: true,
        anchorEl: evt.currentTarget
    });
  }

  handleClose() {
    this.setState({popoverOpen: false});
  };

  tagTextToTags(tag) {
    var rv = [];
    tag.map((text) => {
      var id = rv.length;
      rv.push({id:id, text:text});
    });
    return rv;
  }

  locationButtonSubmit = (geolocation, streetAddress) => {
    console.log("locationButtonSubmit ");
    this.setState({
        geolocation: geolocation,
        streetAddress: streetAddress,
    });
  };

  uploadFinish(imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL) {
    this.setState({galleryEntry: {
      imageURL: imageURL,
      publicImageURL: publicImageURL,
      thumbnailImageURL: thumbnailImageURL,
      thumbnailPublicImageURL: thumbnailPublicImageURL}
    });
//    console.log("uploadFinish: " + this.state.imageURL + " " + this.state.publicImageURL+ " " + this.state.thumbnailImageURL+ " " + this.state.thumbnailPublicImageURL)
  }


  onSubmit() {
    if (this.props.user  != null ) {
      const {user, userProfile} = this.props.user;
      if (user) {
        let isPost = "";
        let isApprovedUrgentEvent = null;
        let galleryEntry = null;
        var commentText = null;
        var tags = null;
        var geolocation = null;
        var streetAddress = null;
        var link = null;
        var status = null;

        switch(this.state.commentSelection) {
            case constant.commentOptions[0]: //"發表回應":
              commentText = this.state.text;
              if(this.state.galleryEntry.imageURL  != null ) {
                galleryEntry = this.state.galleryEntry;
              }
              if(commentText === "") {
                isPost = constant.pleaseInputSummary;
              }
              break;
            case constant.commentOptions[2]: //"要求更改現況":
              status = this.state.changeStatus;
              break;
            case constant.commentOptions[1]: //"要求更改地點":
              geolocation = this.state.geolocation;
              streetAddress = this.state.streetAddress;
              if(geolocation === undefined || geolocation === null) {
                isPost = constant.pleaseInputLocation;
              }
              break;
            case constant.commentOptions[3]: //"要求更改外部連結":
              link = this.state.link;
              if(link === undefined || link === null || link === "") {
                isPost = constant.pleaseInputLink;
              }
              break;
            case constant.commentOptions[4]: //"要求更改分類"
              tags = this.state.tags.map((tag) => tag.text);
              break;
            case constant.commentWithUrgentEventOptions[0]: //"確定為緊急事項"
              if(this.state.text === "") {
                isPost = constant.pleaseInputSummary;
              } else {
                commentText = `${constant.commentWithUrgentEventOptions[0]}: ${this.state.text}`;
                isApprovedUrgentEvent = true;
              }
              break;
            case constant.commentWithUrgentEventOptions[1]: //"確定為非緊急事項"
              if(this.state.text === "") {
                isPost = constant.pleaseInputSummary;
              } else {
                commentText = `${constant.commentWithUrgentEventOptions[1]}: ${this.state.text}`
                isApprovedUrgentEvent = false;
              }
              break;
            case constant.commentWithOwnerOptions[0]: //"更新事項縮圖"
              if(this.state.galleryEntry.imageURL != null ) {
                galleryEntry = this.state.galleryEntry;
              } else {
                isPost = constant.pleaseSelectImage;
              }
              break;
            default:
              break;
        }
        if(isPost === "") {
          this.setState({popoverOpen: false});
          let me = this.props;
          return addComment(this.props.messageUUID, user, userProfile, commentText, galleryEntry, tags, geolocation, streetAddress, link, status, isApprovedUrgentEvent).then(function(commentId){
            if(commentId != 'undefined' || commentId != null) {
              me.openSnackbar(constant.addCommentSuccess, 'success');
              return commentId;
            } else {
              return me.openSnackbar(constant.addCommentFailure, 'error');
            }

          });
        } else {
          this.props.openSnackbar(isPost, 'warning');
          return
        }
      }
    }
    this.setState({popoverOpen: false});
    return null;
  }

  commentOptionSelection(selectedValue) {
      this.setState({commentSelection: selectedValue});
  }

  handleTagChange(value) {
    let tags = [];
    if(value  != null  && value !== '') {
      var partsOfStr = value.split(',');
      partsOfStr.forEach(function(element) {
        tags.push({
          id: tags.length + 1,
          text: element
        });
      });
    }
    this.setState({tags: tags});
  }

  handleDelete(i) {
    let tags = this.state.tags;
    tags.splice(i, 1);
    this.setState({tags: tags});
  }

  handleAddition(tag) {
    let tags = this.state.tags;
    tags.push({
    id: tags.length + 1,
    text: tag
    });
    this.setState({tags: tags});
  }

  handleDrag(tag, currPos, newPos) {
    let tags = this.state.tags;

    // mutate array
    tags.splice(currPos, 1);
    tags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: tags });
  }

  handleThumbnailSelect(image) {
    if(image != null && image.isSelected) {
      this.setState({galleryEntry: {
        imageURL: image.imageURL,
        publicImageURL: image.src,
        thumbnailImageURL: image.thumbnailImageURL,
        thumbnailPublicImageURL: image.thumbnail,
        thumbnailUpdate: true
      }
      });
    }
  }

  renderUpdateMessageThumbnailHtml() {
    const { message } = this.props;
    let imageHtml = (message.publicImageURL != null )
      ?
        <MessageDetailViewImage gallery={message.gallery} url={message.publicImageURL} messageUUID={message.key} enableImageSelection={true} handleThumbnailSelect={this.handleThumbnailSelect}/>
      :
        <MessageDetailViewImage gallery={message.gallery} messageUUID={message.key} enableImageSelection={true} handleThumbnailSelect={this.handleThumbnailSelect}/>;

    return (
      <div>
        {imageHtml}
      </div>
    )
  }

  render() {
    const { classes, message, user } = this.props;
    const { tags } = this.state;

    if(this.state.buttonShow) {
        let inputHtml = <React.Fragment>
          <TextField autoFocus required id="message"  fullWidth  multiline rowsMax="20" margin="normal"
                                helperText="更新事件進度及期望街坊如何參與" value={this.state.text} onChange={event => this.setState({ text: event.target.value })}/>
          <UploadImageButton ref={(uploadImageButton) => {this.uploadImageButton = uploadImageButton;}} path={this.state.imagePath} uploadFinish={(imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL) => {this.uploadFinish(imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL);}}/>
          </React.Fragment>;
        let commentOptions = constant.commentOptions;
        if(user.userProfile  != null  && (user.userProfile.role === RoleEnum.admin || user.userProfile.role === RoleEnum.monitor)) {
          // admin should able to enable any message as urgent.
          //if(message.isReportedUrgentEvent !== 'undefined' && message.isReportedUrgentEvent  != null  && message.isReportedUrgentEvent === true) {
            commentOptions = [...constant.commentOptions, ...constant.commentWithUrgentEventOptions];
          //}
        }

        // update the thumbnail by owner or Admin.
        if(user.userProfile  != null && ((user.userProfile.publishMessages != null && user.userProfile.publishMessages.length > 0 && user.userProfile.publishMessages.includes(message.key))
          ||(user.userProfile.role === RoleEnum.admin || user.userProfile.role === RoleEnum.monitor))) {
          commentOptions = [...commentOptions, ...constant.commentWithOwnerOptions];
        }


        if(this.state.commentSelection !== constant.commentOptions[0]) { //"發表回應"
          //console.log("this.state.commentSelection=" + this.state.commentSelection);
            switch(this.state.commentSelection) {
              case constant.commentOptions[1]: //"要求更改地點"
                inputHtml = <LocationButton autoFocus ref={(locationButton) => {this.locationButton = locationButton;}} onSubmit={this.locationButtonSubmit}/>;
                break;
              case constant.commentOptions[2]: // "要求更改現況"
                inputHtml = <SelectedMenu autoFocus label="" options={constant.statusOptions} changeSelection={(selectedValue) => this.setState({changeStatus: selectedValue})} ref={(statusSelection) => {this.statusSelection = statusSelection}}/>;
                break;
              case constant.commentOptions[3]: //"要求更改外部連結"
                inputHtml = <TextField autoFocus id="link" className={classes.textField} value={this.state.link} onChange={event => this.setState({ link: event.target.value })}/>;
                break;
              case constant.commentOptions[4]: //"要求更改分類"
                inputHtml =
                  <IntegrationReactSelect value={tags}
                  label={constant.tagLabel}
                  placeholder={constant.tagPlaceholder}
                  suggestions={this.props.suggestions.tag}
                  onChange={(value) => this.handleTagChange(value)}
                />
                /*
                inputHtml = <CustomTags tags={tags}
                    inline={false}
                    placeholder="新增分類"
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag} /> ; */
                  break;
              case constant.commentWithUrgentEventOptions[0]: //"確定為緊急事項"
                inputHtml = <TextField autoFocus required id="message" fullWidth margin="normal" helperText="緊急事件" value={this.state.text} onChange={event => this.setState({ text: event.target.value })}/>;
                break;
              case constant.commentWithUrgentEventOptions[1]: //"確定為非緊急事項"
                inputHtml = <TextField autoFocus required id="message" fullWidth margin="normal" helperText="非緊急事件" value={this.state.text} onChange={event => this.setState({ text: event.target.value })}/>;
                break;
              case constant.commentWithOwnerOptions[0]: //"更新事項縮圖"
                inputHtml = this.renderUpdateMessageThumbnailHtml();
                break;
              default:
                break;
              }
        }
      return (
        <div className="cta-report-wrapper">
            <Button className="cta-report"  variant="extendedFab" color="primary" onClick={(evt) => this.handleRequestOpen(evt)}>
              <AddIcon />參與
            </Button>
            <Dialog
                fullScreen
                open={this.state.popoverOpen}
                onClose={() => this.handleClose()}
                transition={Transition}
                aria-labelledby="form-dialog-title"
                unmountOnExit>
                <DialogTitle id="form-dialog-title">更新參與進度</DialogTitle>
                <AppBar className={classes.dialogTitle}>
                  <Toolbar>
                    <IconButton color="contrast" onClick={() => this.handleClose()} aria-label="Close">
                      <CloseIcon />
                    </IconButton>
                    <Typography variant="title" color="inherit" className={classes.flex}>  </Typography>
                    <Button variant="raised" color="primary" onClick={() => this.onSubmit()}>更新參與進度</Button>
                  </Toolbar>
                </AppBar>
                <DialogContent>
                    <DialogContentText>選擇更新範圍</DialogContentText>
                    <SelectedMenu label="" options={commentOptions} changeSelection={(selectedValue) => this.commentOptionSelection(selectedValue)} ref={(commentSelection) => {this.commentSelection = commentSelection}}/>
                    {inputHtml}
                </DialogContent>
            </Dialog>
        </div>
      )
    } else {
      return (
        <div className="cta-report-wrapper">
          <SignInButton label="請先登入方可參與該活動"/>
        </div>
      );
    }
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    user          :   state.user,
    suggestions:  state.suggestions,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    openSnackbar:
      (message, variant) =>
        dispatch(openSnackbar(message, variant)),
      checkAuthState:
          () =>
              dispatch(checkAuthState()),
  }
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(PostCommentView));
