import React, { Component } from 'react';
import {getBookmark} from './UserProfile';
import BookmarkView from './bookmark/BookmarkView';
import PublicProfile from './PublicProfile';

class BookmarkViewSSR extends Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
  }
  componentWillMount() {
    let user = {uid: this.props.userid};
    console.log(`${this.props.userid} ${this.props.bookmarkid}`);
    getBookmark(user, this.props.bookmarkid).then((bookmarkMessage) => {
      console.log(`Get bookmarkMessage`);
      this.setState({bookmark: bookmarkMessage}
    )});

  }

  render() {
    let homeUrl = window.location.protocol + "//" + window.location.hostname;
    let outHtml = null; //<PublicProfile userid={this.props.userid} closeDialog={() => {window.location.href = homeUrl;}}/>
    if(this.state.bookmark  != null ) {
      console.log(`render Bookmark`);
        outHtml = <BookmarkView bookmark={this.state.bookmark} open={true} closeDialog={() => {window.location.href = homeUrl;}} />  
    }
    
    return (outHtml);
  }
};

export default BookmarkViewSSR;
