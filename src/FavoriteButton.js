import * as firebase from 'firebase';
import React, { Component } from 'react';
import Button from 'material-ui/Button';
import FavoriteIcon from 'material-ui-icons/Favorite';
import green from 'material-ui/colors/green';
import red from 'material-ui/colors/red';
import { withStyles } from 'material-ui/styles';
import {updateMessageConcernUser} from './MessageDB';
import {
  isConcernMessage, 
  toggleConcernMessage
} from './UserProfile';


const styles = () => ({
  on: {
    backgroundColor: red[500],
  },
  off: {
    backgroundColor: green[500],
  }
});

class FavoriteButton extends Component {
  constructor(props) {
    super(props);
    this.state = {favor: false};
  }

  componentDidMount() {
    const { user, message } = this.props;
    if(user && message)
    {
      isConcernMessage(user, message.key).then((favor) => {
        this.setState({favor: favor});
      });
    }
  }

  handleFavorClick() {
    const { user, message } = this.props;
    if(user && message)
    {
      toggleConcernMessage(user, message.key).then((favor) => {
        updateMessageConcernUser(message.key, user, favor).then(() => {
          this.setState({ favor: favor });
        });
      });
    }
  };


  render() {
    const { classes } = this.props;
    const { favor } = this.state;
    console.log(this.state);
    const className = favor ? classes.on : classes.off;
    return (
      <Button
        variant="fab"
        color="primary"
        raised={true}
        className={className}
        onClick={() => this.handleFavorClick()}
      >
        <FavoriteIcon />
      </Button>
    );
  }
}


export default  withStyles(styles)(FavoriteButton);
