import React, { Component } from 'react';
import BookmarkView from './BookmarkView';
import {
    checkAuthState,
  } from '../actions';
import {connect} from "react-redux";


class BookmarkList extends Component {
  componentWillMount() {
    this.props.checkAuthState();
  }
  
  render() {
    let elements = null;
    const { user } = this.props;
    elements = user.bookmarkList.map((bookmark) => {
        return (<BookmarkView bookmark={bookmark} OnChange={() => {this.componentWillMount()}}/>);
      });      
    return (<div width="100%" >{elements}</div>);
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


export default connect(
  mapStateToProps,
  mapDispatchToProps
)
(BookmarkList);
