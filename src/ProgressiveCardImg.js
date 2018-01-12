import React, { Component } from 'react';
import CardMedia from 'material-ui/Card';
import * as firebase from 'firebase';

const style = {
  position: 'relative',
  width: '80vw',
  display:'table'
};

class ProgressiveCardImg extends Component {
  constructor(props) {
    super(props);
    this.src = props.gs_src;
    this.width = props.width;
    this.state = {url :'https://www.google.com/images/spin-32.gif'};
  }


  componentDidMount() {
    var imageUri = this.src;
    if (imageUri && imageUri.startsWith('gs://')) {
      firebase.storage().refFromURL(imageUri).getMetadata().then((metadata) => {
      this.setState({url: metadata.downloadURLs[0]});
     });
    } else {
      this.setState({url: null})
    }
  }

  render() {
      return (<CardMedia >
               <img src={this.state.url} style={style}/>
              </CardMedia>)
  }
}

export default ProgressiveCardImg;
