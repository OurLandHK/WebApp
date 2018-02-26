import * as firebase from 'firebase';
import React, { Component } from 'react';
import { CardActions, CardContent, CardMedia} from 'material-ui/Card';
import ProgressiveCardImg from './ProgressiveCardImg';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ForumIcon from 'material-ui-icons/Forum';
import EmailIcon from 'material-ui-icons/Email';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import red from 'material-ui/colors/red';
import FavoriteIcon from 'material-ui-icons/Favorite';
import ShareIcon from 'material-ui-icons/Share';
import MessageDetailView from './MessageDetailView';
import {updateMessageConcernUser} from './MessageDB';
import ShareDrawer from './ShareDrawer';
import yellow from 'material-ui/colors/yellow';
import {
  isConcernMessage, 
  toggleConcernMessage
} from './UserProfile';
import {
  ShareButtons,
  ShareCounts,
  generateShareIcon
} from 'react-share';

const someNetwork = {
  verticalAlign: "top",
  display: "inline-block",
  marginRight: "1em",
  textAlign: "center",
  height: '80%',
};

const buttonStyle = {
  width: '3.3em',
  height: '3.3em',
};

const forumButtonStyle = {
  ...buttonStyle,
  backgroundColor: yellow[500],
};



const styles = theme => ({
  bottom: {
    position: 'fixed',
    bottom:'0%',
    height:'10vh',
    backgroundColor: theme.palette.primary['400'],
    width: '100%'
  },
  root: {
    width: 500,
  },  
  card: {
    maxWidth: 400,
  },
  avatar: {
    backgroundColor: red[500],
  },
  flexGrow: {
    flex: '1 1 auto',
  },
  someNetwork: someNetwork,
  someNetworkShareCount: {
    color: 'white',
    marginLeft: '0.3em',
    fontSize: '1.0em',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  someNetworkShareButton: {
    cursor: "pointer",
  },
  facebook: {
    ...someNetwork,
    display: 'flex',
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
        updateMessageConcernUser(uuid, user, favor).then(() => {
          this.setState({ favor: favor });
        });
      });
    }
  };

  favorColor() {
    var favorColor = 'primary';
    if(this.state.favor)
    {
      favorColor = 'accent';
    }
    return favorColor;
  }

  renderFavorite() {
    const {classes} = this.props;
    return (

      <div className={classes.someNetwork}>
        <Button
          color={this.favorColor()}
          onClick={() => this.handleFavorClick()}
          aria-label="Add to favorites"
          fab
          style={buttonStyle}
        >
          <FavoriteIcon />
        </Button>
      </div>
    );
  }


  render() {
    const classes = this.props.classes;
    return(
      <div>
      <CardActions disableActionSpacing>
        { this.renderFavorite() }
        <ShareDrawer message={this.props.message}/>
        <div className={classes.flexGrow} />
    </CardActions>
    </div>);
  }
}

export default withStyles(styles) (MessageExpandView);
