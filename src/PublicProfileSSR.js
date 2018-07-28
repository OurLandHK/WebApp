import React, { Component } from 'react';
import {connect} from "react-redux";
import {
  togglePublicProfileDialog, 
} from './actions';

import PublicProfile from './PublicProfile';

class PublicProfileSSR extends Component {
  componentWillMount() {

  }

  render() {
    const { userid } = this.props;
    let homeUrl = window.location.protocol + "//" + window.location.hostname;
    return (
      <div>
        <PublicProfile userid={userid} closeDialog={() => {window.location.href = homeUrl;}}/>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
    return {
      open: state.publicProfileDialog.open,
      id: state.publicProfileDialog.id,
    };
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
      togglePublicProfileDialog: flag => 
        dispatch(togglePublicProfileDialog(flag)),
    }
  };

export default connect(mapStateToProps, mapDispatchToProps)(PublicProfileSSR);
