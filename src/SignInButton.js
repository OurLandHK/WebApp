import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { connect } from "react-redux";
import { SocialIcon } from 'react-social-icons';
import { withStyles } from 'material-ui/styles';
import ExitToApp from 'material-ui-icons/ExitToApp';
import { checkAuthState, signOut, signIn } from "./actions";

const styles = theme => ({
  button: {
    color: '#FFFFFF',
  },
});

class SignInButton extends  Component {
  constructor(props) {
    super(props);
    this.state = {loading: true};
  }

  componentDidMount() {
    const { checkAuthState } = this.props;
    checkAuthState();
  }
 
  render() {
    const { classes, user, signOut, signIn } = this.props;

    if (user.loading) {
      return (<div></div>);
    }

    if (user.user) {
      return (
        <Button
          variant="raised"
          color="secondary"
          onClick={signOut}
        >
          <ExitToApp />&nbsp;&nbsp;
          登出
        </Button>
      );
    }
    else
    {
      return (
        <Button
          variant="raised"
          onClick={signIn}
          color="primary"
          className={classes.button}
        >
          <SocialIcon
            color="white"
            network="facebook"
            style={{ height: 25, width: 25 }}
          />&nbsp;
          使用Facebook登入
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
    checkAuthState: () => dispatch(checkAuthState()),
    signOut: () => dispatch(signOut()),
    signIn: () => dispatch(signIn())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SignInButton));
