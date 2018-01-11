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
      var imgURL = (user.photoURL || '/images/profile_placeholder.png');
      return (<div style={{alignItems: "center", display: "flex"}}>&nbsp;&nbsp;&nbsp;<img src={imgURL} style={{height:"20px", width:"20px"}}/>&nbsp;&nbsp;{user.displayName}&nbsp;&nbsp;<Button raised secondary={true} onClick={signOut}>登出</Button></div>);
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
