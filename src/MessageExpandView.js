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
    this.state = {expanded: false, rotate: 'rotate(0deg)'};
  }

  handleExpandClick() {
    this.setState({ expanded: !this.state.expanded });

  };


  render() {
    const classes = this.props.classes;
    var m = this.props.message;
      return(
          <div>         
                <CardActions disableActionSpacing>
                    <IconButton aria-label="Add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="Share">
                        <ShareIcon />
                    </IconButton>
                    <div className={classes.flexGrow} />
                    <IconButton
                        className={classnames(classes.expand, {
                            [classes.expandOpen]: this.state.expanded,
                        })}
                        onClick={() => this.handleExpandClick()}
                        aria-expanded={this.state.expanded}
                        aria-label="Show more"
                        >
                        <ExpandMoreIcon />
                    </IconButton> 
                </CardActions>                       
                <Collapse in={this.state.expanded} transitionDuration="auto" unmountOnExit>
                        <MessageDetailView message={m}/>
                </Collapse>                      
            </div>);                                    
    }
}

export default withStyles(styles) (MessageExpandView);