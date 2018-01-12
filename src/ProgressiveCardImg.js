import React, { Component } from 'react';
import CardMedia from 'material-ui/Card';
import * as firebase from 'firebase';

const style = {
  width: '100vw',
  height: '40vh',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  verticalAlign: 'middle',
  display: 'table-cell',
  textAlign: 'center'
};

class ProgressiveCardImg extends Component {
  constructor(props) {
    super(props);
    this.src = props.gs_src;
    this.width = props.width;
    this.state = {loading: true};
  }


  componentDidMount() {
    var imageUri = this.src;
    if (imageUri && imageUri.startsWith('gs://')) {
      firebase.storage().refFromURL(imageUri).getMetadata().then((metadata) => {
      this.setState({url: metadata.downloadURLs[0], loading: false});
     });
    } else {
      this.setState({url: null, loading: false})
    }
  }

  render() {
      const url = this.state.url && "url(" + this.state.url + ")";
      const {loading} = this.state;
      return (<CardMedia >
               <div style={{...style, backgroundImage: url}}>
               {loading && <img src='https://www.google.com/images/spin-32.gif'/>}
               </div>
              </CardMedia>)
  }
}

export default ProgressiveCardImg;
