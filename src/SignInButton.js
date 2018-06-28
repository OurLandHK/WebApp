import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import { SocialIcon } from 'react-social-icons';
import { withStyles } from '@material-ui/core/styles';
import ExitToApp from '@material-ui/icons/ExitToApp';
import { signOut, signIn } from "./actions";

class SignInButton extends  Component {
  constructor(props) {
    super(props);
    this.state = {loading: true};
  }

  render() {
    const { classes, user, signOut, signIn } = this.props;

    if (user.loading) {
      return (<div></div>);
    }

    if (user.user) {
      return (null);
    }
    else
    {
      return (
        <Button
          variant="raised"
          onClick={signIn}
          color="primary"
        >
          <SocialIcon
            color="white"
            network="facebook"
            style={{ height: 25, width: 25 }}
          />&nbsp;登入
        </Button>
      );
    }
  }
}

SignInButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    geoLocation : state.geoLocation,
    user: state.user
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut()),
    signIn: () => dispatch(signIn())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInButton);
