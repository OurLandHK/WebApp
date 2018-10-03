import React, { Component } from 'react';
import BookmarkView from './BookmarkView';
import {
    checkAuthState,
  } from '../actions';
import {connect} from "react-redux";


class BookmarkList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarkList: []
    }
  }  

  componentDidMount() {
    if(this.props.bookmarkList != undefined && this.props.bookmarkList != null) {
      let bookmarkList = this.props.bookmarkList;
      this.setState({ bookmarkList });
    }
  }
  
  render() {
    let elements = null;
    const { bookmarkList } = this.state;
    if(bookmarkList !== undefined) {
        elements = bookmarkList.map((bookmark) => {
            return (<BookmarkView bookmark={bookmark} OnChange={() => {this.componentWillMount()}}/>);
        });      
    }
    return (<div width="100%" >{elements}</div>);
  }
};


const mapStateToProps = (state, ownProps) => {
  return {

  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    
  }
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)
(BookmarkList);
