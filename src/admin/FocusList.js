import React, { Component } from 'react';
import * as firebase from 'firebase';
import config from '../config/default';
import FocusView from './FocusView';
import {
    fetchConcernMessagesFromOurLand,
  } from '../actions';
import {connect} from "react-redux";


class FocusList extends Component {
  componentWillMount() {
    this.props.fetchConcernMessagesFromOurLand();
  }
  
  render() {
    let elements = null;
    const { ourland } = this.props;
    elements = ourland.globalFocusMessages.map((focus) => {
        return (<FocusView focus={focus} OnChange={() => {this.componentWillMount()}}/>);
      });      
    return (<div width="100%" >{elements}</div>);
  }
};


const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    ourland: state.ourland,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchConcernMessagesFromOurLand:
      () => dispatch(fetchConcernMessagesFromOurLand()),    
  }
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)
(FocusList);
