import ProgressiveCardImg from './ProgressiveCardImg';
import Grid from 'material-ui/Grid';
import {FormGroup} from 'reactstrap';
import React, { Component } from 'react';
import { CardActions, CardContent, CardMedia} from 'material-ui/Card';
import UploadImageButton from './UploadImageButton';
import Button from 'material-ui/Button';
import {updateMessageImageURL} from './MessageDB';
import uuid from 'js-uuid';


class MessageDetailViewImage extends Component {
   constructor(props) {
        super(props);
        var key = uuid.v4();
        this.state = {
            key: key,
            imageURL: null, 
            publicImageURL: null, 
            thumbnailImageURL: null, 
            thumbnailPublicImageURL: null
        };
    }   

  uploadFinish(imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL) {  
    this.setState({
      imageURL: imageURL, 
      publicImageURL: publicImageURL, 
      thumbnailImageURL: thumbnailImageURL, 
      thumbnailPublicImageURL: thumbnailPublicImageURL
    });
   }

   onSubmit(){
      updateMessageImageURL(this.props.messageUUID, this.state.imageURL, this.state.publicImageURL);
   }

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
          <br/>
          <FormGroup>  
          <br/>
          <UploadImageButton ref={(uploadImageButton) => {this.uploadImageButton = uploadImageButton;}} path={this.state.key} uploadFinish={(imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL) => {this.uploadFinish(imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL);}}/>
          </FormGroup>
          <Button color="contrast" onClick={() => this.onSubmit()}>
            提交
          </Button>
        </center>
      </div>
    );
  }
}

export default MessageDetailViewImage;
