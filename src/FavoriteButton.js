import * as firebase from 'firebase';
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import FavoriteIcon from '@material-ui/icons/Favorite';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import { withStyles } from '@material-ui/core/styles';
import {updateMessageConcernUser} from './MessageDB';
import {
  isConcernMessage, 
  toggleConcernMessage
} from './UserProfile';
import {connect} from "react-redux";
import {
  checkAuthState
} from './actions';


const styles = () => ({
  base: {
    borderRadius: 0,
    width: '64px',
    height: '64px'
  },
  on: {
    backgroundColor: red[500],
    '&:hover': {
       backgroundColor: red[500]
    }
  },
  off: {
    backgroundColor: green[500],
    '&:hover': {
       backgroundColor: green[500]
    }
  }
});

class FavoriteButton extends Component {
  constructor(props) {
    super(props);
    this.state = {favor: false};
  }

  componentDidMount() {
    const { user, message } = this.props;
    if(user && user.user && message)
    {
      isConcernMessage(user.user, message.key).then((favor) => {
        this.setState({favor: favor});
      });
    }
  }

  handleFavorClick() {
    const { user, message } = this.props;
    if(user && user.user && message)
    {
      toggleConcernMessage(user.user, message.key).then((favor) => {
        updateMessageConcernUser(message.key, user.user, favor).then(() => {
          this.props.checkAuthState();
          this.setState({ favor: favor });
        });
      });
    }
  };


  render() {
    const { classes } = this.props;
    const { favor } = this.state;
    console.log(this.state);
    const favorClass = favor ? classes.on : classes.off;
    const baseClass = classes.base;
    return (
      <Button
        color="primary"
        variant="fab"
        raised={true}
        className={`${baseClass} ${favorClass}`}
        onClick={() => this.handleFavorClick()}
      >
        <FavoriteIcon />
      </Button>
    );
  }
}

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


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FavoriteButton));
