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
import {isConcernMessage, toggleConcernMessage} from './UserProfile';



const styles = theme => ({
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
});


class MessageExpandView extends Component {
  constructor(props) {
    super(props);
    this.state = {favor: false};
  }

  componentDidMount() {
    var user = this.props.user;
    var uuid = this.props.uuid;
    isConcernMessage(user, uuid).then((favor) => {
      this.setState({favor: favor});
    });
  }
  

  handleFavorClick() {
    var user = this.props.user;
    var uuid = this.props.uuid;
    console.log("uuid: " +  uuid);
    toggleConcernMessage(user, uuid).then((favor) => {
      this.setState({ favor: favor });
    });
  };


  render() {
    const classes = this.props.classes;
    var m = this.props.message;
    var user = this.props.user;
    var favorColor = 'primary';
    if(this.state.favor)
    {
      favorColor = 'accent';
    }
      return(
        <CardActions disableActionSpacing>
            <IconButton 
                color={favorColor}
                onClick={() => this.handleFavorClick()}
                aria-label="Add to favorites">
                <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="Share">
                <ShareIcon />
            </IconButton>
            <div className={classes.flexGrow} />
      </CardActions>);                       
    }
}

export default withStyles(styles) (MessageExpandView);
