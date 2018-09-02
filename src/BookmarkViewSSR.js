import React, { Component } from 'react';
import {getBookmark} from './UserProfile';
import BookmarkView from './bookmark/BookmarkView';

class PublicProfileSSR extends Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
  }
  componentWillMount() {
    let user = {uid: this.props.userid};
    getBookmark(user, this.props.bookmarkid).then((bookmarkMessage) => {this.setState({bookmark: bookmarkMessage})});

  }

  render() {
    let outHtml = null;
    let homeUrl = window.location.protocol + "//" + window.location.hostname;
    if(this.state.bookmark  != null ) {
        outHtml = <BookmarkView bookmark={this.state.bookmark} open={true} closeDialog={() => {window.location.href = homeUrl;}} />  
    }
    
    return (
      <div>
          {outHtml}
      </div>
    );
  }
};

export default PublicProfileSSR;
