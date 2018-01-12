import * as firebase from 'firebase';
import React, { Component } from 'react';
import { CardActions, CardContent, CardMedia} from 'material-ui/Card';
import ProgressiveCardImg from './ProgressiveCardImg';
import IconButton from 'material-ui/IconButton';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ForumIcon from 'material-ui-icons/Forum';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import red from 'material-ui/colors/red';
import FavoriteIcon from 'material-ui-icons/Favorite';
import ShareIcon from 'material-ui-icons/Share';
import MessageDetailView from './MessageDetailView';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import {
  isConcernMessage, 
  toggleConcernMessage
} from './UserProfile';
import {
  ShareButtons,
  ShareCounts,
  generateShareIcon
} from 'react-share';



const styles = theme => ({
  bottom: {
    position: 'fixed',
    bottom:'0%',
    height:'10vh',
    backgroundColor: theme.palette.primary['400'],
    width: '100%'
  },
  card: {
    maxWidth: 400,
  },
  media: {
    height: 960,
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  flexGrow: {
    flex: '1 1 auto',
  },
  someNetwork: {
    verticalAlign: "top",
    display: "inline-block",
    marginRight: "30px",
    textAlign: "center",
  },
  someNetworkShareCount: {
    marginTop: "3px",
    fontSize: "12px",
  },
  someNetworkShareButton: {
    cursor: "pointer",
  },
});

const {
  FacebookShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  EmailShareButton,
} = ShareButtons;

const {
  FacebookShareCount,
} = ShareCounts;

const FacebookIcon = generateShareIcon('facebook');
const TelegramIcon = generateShareIcon('telegram');
const WhatsappIcon = generateShareIcon('whatsapp');
const EmailIcon = generateShareIcon('email');


class MessageExpandView extends Component {
  constructor(props) {
    super(props);
    this.state = {favor: false};
  }

  componentDidMount() {
    var user = this.props.user;
    var uuid = this.props.uuid;
    if(user)
    {
      isConcernMessage(user, uuid).then((favor) => {
        this.setState({favor: favor});
      });
    }
  }
  

  handleFavorClick() {
    var user = this.props.user;
    var uuid = this.props.uuid;
    console.log("uuid: " +  uuid);
    if(user)
    {
      toggleConcernMessage(user, uuid).then((favor) => {
        this.setState({ favor: favor });
      });
    }
  };

  facebookHashTag(tags) {
    var tagsLength = 0
    if(tags != null) {
      tagsLength = tags.length;
    }
    var tagString = '';
    for (var i = 0; i < tagsLength; i++) {
      tagString += "#"+tags[i] + " ";
    }
    console.log("HashTag String:" + tagString);
    return tagString;

  }

  facebookQuote(message) {
/*    var quote = "<meta property=\"og:type\"               content=\"article\" />" +
                "<meta property=\"og:title\"              content=\"" + message.text + "\" />" +
                "<meta property=\"og:description\"        content=\"Location"  +  "" + "\" />";
*/
    var quote = message.text;
    return quote;    
  }


  render() {
    const classes = this.props.classes;
    var m = this.facebookQuote(this.props.message);
    var hashtag = this.facebookHashTag(this.props.message.tag);
    var shareUrl = window.location.protocol + "//" + window.location.hostname + "/?eventid=" + this.props.uuid;
    var favorColor = 'primary';
    if(this.state.favor)
    {
      favorColor = 'accent';
    }
      return(
        <div className={classes.bottom}>
        <CardActions disableActionSpacing>
            <IconButton 
                color={favorColor}
                onClick={() => this.handleFavorClick()}
                aria-label="Add to favorites">
                <FavoriteIcon />
            </IconButton>
            <div className={classes.someNetwork}>
              <FacebookShareButton
                url={shareUrl}
                quote={m}
                hashtag={hashtag}
                className={classes.someNetworkShareButton}>
                <FacebookIcon
                  size={32}
                  round />
              </FacebookShareButton>
    
              <FacebookShareCount
                url={shareUrl}
                className={classes.someNetworkShareCount}>
                {count => count}
              </FacebookShareCount>
            </div>
            <div className={classes.someNetwork}>
              <WhatsappShareButton
                url={shareUrl}
                title={m}
                separator=":: "
                className={classes.someNetworkShareButton}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
            </div>

            <div className={classes.someNetwork}>
              <EmailShareButton
                url={shareUrl}
                subject={m}
                body={shareUrl}
                className={classes.someNetworkShareButton}>
                <EmailIcon
                  size={32}
                  round />
              </EmailShareButton>
          </div>                     
            <div className={classes.flexGrow} />
      </CardActions>
      </div>);                       
    }
}

export default withStyles(styles) (MessageExpandView);
