import React, { Component } from 'react';
import BookmarkView from './BookmarkView';
import {connect} from "react-redux";
import { array } from 'prop-types';


class BookmarkList extends Component {
  constructor(props) {
    super(props);
    this.limitLength = 0;
    if(this.props.limitLength !== undefined) {
      this.limitLength = this.props.limitLength
    }
    this.state = {
      bookmarkList: this.props.bookmarkList
    }
  }

  componentDidMount() {
    if(this.props.bookmarkList !== undefined && this.props.bookmarkList !== null) {
      let bookmarkList = [];
      if(this.limitLength === 0) {
        bookmarkList = this.props.bookmarkList;
      } else {
        bookmarkList = this.props.bookmarkList.slice(0, this.limitLength);
      }
      this.setState({ bookmarkList });
    }
  }

  render() {
    let elements = null;
    let bookmarkList = this.state.bookmarkList;
    if(bookmarkList !== undefined && this.props.bookmarkList !== undefined && bookmarkList.length < this.props.bookmarkList.length) {
      bookmarkList = this.props.bookmarkList;
    }
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
)(BookmarkList);
