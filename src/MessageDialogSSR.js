import React, { Component } from 'react';
import {getMessage} from './MessageDB';
import {connect} from "react-redux";
import {
  checkAuthState,
} from './actions';

import MessageDialog from './MessageDialog';
import MessageDetailView from  './MessageDetailView';


class MessageDialogSSR extends Component {
  componentWillMount() {
    const { checkAuthState, uuid } = this.props;
    checkAuthState();
  }

  render() {
    const { user, uuid } = this.props;
    return (
      <div>
        {user &&
         <MessageDialog
           uuid={uuid}
           open={true}
           openDialog={()=>{}} openDialog={openDialog => this.openDialog = openDialog}
           ref={(messageDialog) => {this.messageDialog = messageDialog;}}
           closeDialog={() => {window.history.back();}} 
         />
        }
      </div>
    );
  }
};

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

export default connect(mapStateToProps, mapDispatchToProps)(MessageDialogSSR);
