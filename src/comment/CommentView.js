import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import timeOffsetStringInChinese from '../TimeString';
import { withStyles } from 'material-ui/styles';
import red from 'material-ui/colors/red';
import Avatar from 'material-ui/Avatar';
import geoString from '../GeoLocationString';
import config, {constant} from '../config/default';
import {
    checkAuthState,
    updateRecentMessage,
    updatePublicProfileDialog,
  } from '../actions';
import {connect} from 'react-redux';


const styles = theme => ({
    card: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 64,
        height: 64,
    },
});

class CommentView extends Component {
  constructor(props) {
    super(props);
    this.handleAuthorClick = this.handleAuthorClick.bind(this);
  }


  handleAuthorClick() {
    const {comment, updatePublicProfileDialog} = this.props;
    if (comment.uid) {
      updatePublicProfileDialog(comment.uid, "", true)
    } else {
        console.log("no uid");
    }
  };

  render() {
    const { classes, theme } = this.props;
    var c = this.props.comment;
    var text = c.text;
    if(text == null) {
        if(c.geolocation != null) {
            var locationString = null;
            if(c.streetAddress != null) {
                locationString =  c.streetAddress + " (" + geoString(c.geolocation.latitude, c.geolocation.longitude) + ")";
              } else {
                locationString = "近" + geoString(c.geolocation.latitude, c.geolocation.longitude);      
              } 
            text = constant.commentOptions[1] + locationString;
        } else {
            if(c.changeStatus != null) {
                text = constant.commentOptions[2] + c.changeStatus;
            } else {
                if(c.link != null) {
                    text = constant.commentOptions[3] + c.link;
                } else {
                    if(c.tags != null) {
                        var tagText = c.tags.map((text) => {return ('#'+text+' ')});
                        text = constant.commentOptions[4] + ': ' + tagText;
                    }
                }
            }          
        }
    }
    var timeOffset = Date.now() - c.createdAt;
    var timeOffsetString = timeOffsetStringInChinese(timeOffset);
    var subtitle = '張貼於： ' + timeOffsetString + '前';
    let fbProfileImage = <Avatar src={c.photoUrl} onClick={() => this.handleAuthorClick()} />;
/*
    let fbProfileImage = <CardMedia
                            className={classes.cover}
                            image={c.photoUrl}
                            title={c.name}
                            onClick={() => this.handleAuthorClick()}
                            />  
*/
    return (<Card className={classes.card}>
                {fbProfileImage}               
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography variant="subheading">{text}</Typography>
                        <Typography variant="caption" color="textSecondary">
                        {subtitle}
                        </Typography>
                    </CardContent>
                </div>
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
  

  export default connect(
    mapStateToProps,
    mapDispatchToProps
    )
    (withStyles(styles, { withTheme: true })(CommentView));
