import React, { Component } from 'react';
import CardMedia from 'material-ui/Card';
import * as firebase from 'firebase';

class ProgressiveCardImg extends Component {
  constructor(props) {
    super(props);
    this.src = props.gs_src;
    this.height = props.height;
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
                    <img src={this.state.url} />
            </CardMedia>)
//    return (<CardImg height={this.height} src={this.state.url}/>)
  }
}

export default ProgressiveCardImg;
