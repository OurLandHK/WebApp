import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { connect } from "react-redux";
import { checkAuthState, signOut, signIn } from "./actions";

class SignInButton extends  Component {

  componentDidMount() {
    const { checkAuthState } = this.props;
    checkAuthState();
  }
 
  render() {
    const {classes, user, signOut, signIn} = this.props;
    console.log(user);
    if (user) {
      return (<Button raised secondary={true} onClick={signOut}>登出</Button>);
    }
    else
    {
      return (<Button raised onClick={signIn} primary={true}>使用Facebook登入</Button>);
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
    checkAuthState: () => dispatch(checkAuthState()),
    signOut: () => dispatch(signOut()),
    signIn: () => dispatch(signIn())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInButton);
