import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
//import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import timeOffsetStringInChinese from '../TimeString';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import geoString from '../GeoLocationString';
import {constant, RoleEnum} from '../config/default';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import {
    checkAuthState,
    updatePublicProfileDialog,
  } from '../actions';

import {updateCommentApproveStatus, getMessage, updateMessage, addMessageGalleryEntry, updateMessageThumbnail} from '../MessageDB';
import {addCompleteMessage} from '../UserProfile';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';


const styles = theme => ({
    card: {
        display: 'flex',
        alignItems: 'center'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    tileMedia: {
        width: 151,
        height: 151,
    },    
});

class CommentView extends Component {
  constructor(props) {
    super(props);
    this.handleAuthorClick = this.handleAuthorClick.bind(this);
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
    this.commentOption = constant.commentOptions[0];
  }

  approve() {
    const {messageUUID, commentRef, user} = this.props;
    const {geolocation, streetAddress, changeStatus, link, tags, galleryEntry, text} = commentRef.data();
    console.log(galleryEntry)
    let isCommplete = false;
    return getMessage(messageUUID).then((messageRecord) => {
        let messageuid=messageRecord.uid;
        switch(this.commentOption) {
            case constant.commentOptions[2]: //"要求更改現況":
                console.log('Option: ' + constant.commentOptions[2]);
                switch(changeStatus) {
                    case constant.statusOptions[1]: //'完結'
                        messageRecord.status=changeStatus;
                        isCommplete = true;
                        break;
                    case constant.statusOptions[3]: //'虛假訊息'
                    case constant.statusOptions[4]: //'不恰當訊息',
                        messageRecord.hide = true;
                        break;
                    case constant.statusOptions[0]: //'開放'
                    case constant.statusOptions[2]: //'政府跟進中'
                    default:
                        messageRecord.status=changeStatus;
                        break;
                    }
                break;
            case constant.commentOptions[1]: //"要求更改地點":
                console.log('Option: ' + constant.commentOptions[1]);
                messageRecord.geolocation = geolocation;
                messageRecord.streetAddress = streetAddress;
                break;
            case constant.commentOptions[3]: //"要求更改外部連結":
                console.log('Option: ' + constant.commentOptions[3]);
                messageRecord.link = link;
                break;
            case constant.commentOptions[4]: //"要求更改分類"
                console.log('Option: ' + constant.commentOptions[4]);
                messageRecord.tag = tags;
                break;
            case constant.commentWithUrgentEventOptions[0]: //"確定為緊急事項"
                console.log('Option: ' + constant.commentWithUrgentEventOptions[0]);
                messageRecord.isUrgentEvent = true;
                messageRecord.isApprovedUrgentEvent = true;
                break;
            case constant.commentWithUrgentEventOptions[1]: //"確定為非緊急事項"
                console.log('Option: ' + constant.commentWithUrgentEventOptions[1]);
                messageRecord.isUrgentEvent = false;
                messageRecord.isApprovedUrgentEvent = false;
                break;
            case constant.commentWithOwnerOptions[0]: //"更新事項縮圖"
                console.log('Option: ' + constant.commentWithOwnerOptions[0]);
                messageRecord = null;
                break;
            case  constant.commentOptions[0]: //"發表回應":
            default:
                console.log('Option: ' + constant.commentOptions[0]);
                messageRecord = null; // for update time
                break;                
        }

        return updateMessage(messageUUID, messageRecord, true).then(() => {
            let now = Date.now();
            let approvedStatus = {
                createdAt: new Date(now),
                name: user.userProfile.displayName,
                fbuid: user.userProfile.fbuid,
                isConfirm: constant.approveOptions[0],
            }
            if(isCommplete) {
                let commentUser = {uid: commentRef.data().uid};
                return addCompleteMessage(commentUser, messageUUID).then(() => {
                    return updateCommentApproveStatus(messageUUID, commentRef.id, approvedStatus).then((ref) => {
                        if(messageuid !== commentUser.uid) {
                            let messageUser = {uid: messageuid};
                            return addCompleteMessage(messageUser, messageUUID).then(() => {
                                return ref;
                            })
                        } else {
                            return ref;
                        }
                    });
                })
            } else {
                return updateCommentApproveStatus(messageUUID, commentRef.id, approvedStatus).then(() => {
                    if(galleryEntry  !== null  && galleryEntry !== undefined) {
                        addMessageGalleryEntry(messageUUID, galleryEntry.imageURL, galleryEntry.publicImageURL, galleryEntry.thumbnailImageURL, galleryEntry.thumbnailPublicImageURL, text);

                        if(galleryEntry.thumbnailUpdate != null &&  galleryEntry.thumbnailUpdate != undefined && galleryEntry.thumbnailUpdate) {
                            updateMessageThumbnail(messageUUID, galleryEntry.imageURL, galleryEntry.publicImageURL, galleryEntry.thumbnailImageURL, galleryEntry.thumbnailPublicImageURL);
                        } 
                    } 
                    return;  
                });
            }
        })
    })
  }

  reject() {
    const {messageUUID, commentRef, user} = this.props;
    let now = Date.now();
    let approvedStatus = {
        createdAt: new Date(now),
        name: user.userProfile.displayName,
        fbuid: user.userProfile.fbuid,
        isConfirm: constant.approveOptions[1],
    }
    updateCommentApproveStatus(messageUUID, commentRef.id, approvedStatus);
  }

  handleAuthorClick() {
    const {commentRef, updatePublicProfileDialog} = this.props;
    const comment = commentRef.data();
    if (comment.uid) {
      updatePublicProfileDialog(comment.uid, "", true)
    } else {
        console.log("no uid");
    }
  };

  render() {
    const { classes, user, commentRef } = this.props;
    const comment = commentRef.data();
    const {galleryEntry, approvedStatus, geolocation, streetAddress, changeStatus, link, tags, createdAt, photoUrl, isApprovedUrgentEvent} = comment;
    let text = comment.text;
    let galleryImage = null;
    if(text === null) {
        if(geolocation  != null ) {
            var locationString = null;
            if(streetAddress  != null ) {
                locationString =  streetAddress + " (" + geoString(geolocation.latitude, geolocation.longitude) + ")";
              } else {
                locationString = "近" + geoString(geolocation.latitude, geolocation.longitude);
              }
            text = constant.commentOptions[1] + locationString;
            this.commentOption = constant.commentOptions[1];
        } else {
            if(changeStatus  != null ) {
                text = constant.commentOptions[2] + changeStatus;
                this.commentOption = constant.commentOptions[2];
            } else {
                if(link  != null ) {
                    text = constant.commentOptions[3] + link;
                    this.commentOption = constant.commentOptions[3];
                } else {
                    if(tags  != null ) {
                        var tagText = tags.map((text) => {return ('#'+text+' ')});
                        text = constant.commentOptions[4] + ': ' + tagText;
                        this.commentOption = constant.commentOptions[4];
                    }
                }
            }
        }
    } 
    if(galleryEntry  != null ) {
        galleryImage =  <CardMedia className={classes.tileMedia} image={galleryEntry.publicImageURL}/>
    }
    if(isApprovedUrgentEvent  != null ) {
        this.commentOption = isApprovedUrgentEvent? constant.commentWithUrgentEventOptions[0]: constant.commentWithUrgentEventOptions[1];
    }

    let approvedButton = null;
    let approvedLog = "";
    if(approvedStatus === null || approvedStatus === undefined) {
      if(user  != null  && user.userProfile  != null  && user.userProfile.role === RoleEnum.admin) {
        approvedButton = <React.Fragment>
                            <Button variant="raised" color="primary" className={classes.uploadButton} raised={true} onClick={() => this.approve()}>
                                <ThumbUpIcon />
                                    {constant.approveOptions[0]}
                            </Button>
                            <Button variant="raised" color="primary" className={classes.uploadButton} raised={true} onClick={() => this.reject()}>
                                <ThumbDownIcon />
                                    {constant.approveOptions[1]}
                            </Button>
                        </React.Fragment>
      }
    } else {
        let approvedTimeOffset = Date.now() - approvedStatus.createdAt.toDate();
        let approvedTimeOffsetString = timeOffsetStringInChinese(approvedTimeOffset);
        approvedLog ='由' + approvedStatus.name + '於 ' + approvedTimeOffsetString + ' 前 ' + approvedStatus.isConfirm;
    }

    let timeOffset = Date.now() - createdAt.toDate();
    let timeOffsetString = timeOffsetStringInChinese(timeOffset);
    let subtitle = '張貼於：' + timeOffsetString + '前 ' + approvedLog;
    let fbProfileImage = <Avatar src={photoUrl} onClick={() => this.handleAuthorClick()} />;
    return (<Card container className={classes.card}>    
                {fbProfileImage}               
                <div className={classes.details}>
                    <CardContent className={classes.content} zeroMinWidth>
                        <Typography variant="subheading">{text}</Typography>
                        <Typography variant="caption" color="textSecondary">
                        {subtitle}
                        </Typography>
                    </CardContent>
                </div>
                {approvedButton}
                {galleryImage} 
            </Card>);
  }
}

CommentView.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };

  const mapStateToProps = (state, ownProps) => {
    return {
      user          :   state.user,
    };
  }

  const mapDispatchToProps = (dispatch) => {
    return {
        updatePublicProfileDialog:
            (userId, fbuid, open) =>
                dispatch(updatePublicProfileDialog(userId, fbuid, open)),
        checkAuthState:
            () =>
                dispatch(checkAuthState()),
    }
  };


  export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles, { withTheme: true })(CommentView));
