import ProgressiveCardImg from './ProgressiveCardImg';
import Grid from 'material-ui/Grid';
import React, { Component } from 'react';
import { CardActions, CardContent, CardMedia} from 'material-ui/Card';


class MessageDetailViewImage extends Component {
  render() {
    const { url } = this.props;
    if(url != null) {
      return (<ProgressiveCardImg gs_src={url}/>);
    }
    return (
      <div>
        <center>
          <br/>
          <h1>沒有圖片</h1>
        </center>
      </div>
    );
  }
}

export default MessageDetailViewImage;
