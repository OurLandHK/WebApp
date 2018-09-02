import * as firebase from 'firebase';
import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
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
    margin: 0,
    borderRadius: 0,
    width: '64px',
    height: '64px'
  },
  on: {
    color: 'secondary',
  },
  off: {
    color: null,
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
    const { favor } = this.state
    const favorClass = favor ? 'secondary' : '';
    const baseClass = classes.base;
    const iconHtml = favor ? <PlaylistAddCheckIcon/> : <PlaylistAddIcon/>;
    let disable = true;
    if(this.props.user  != null  && this.props.user.user  != null ) {
      disable = false;
    }
    let outputHtml = <IconButton
                        className={baseClass}
                        disabled={disable}
                        color={favorClass}
                        onClick={() => this.handleFavorClick()}
                        >
                      {iconHtml}
                    </IconButton>
    return (outputHtml);
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
