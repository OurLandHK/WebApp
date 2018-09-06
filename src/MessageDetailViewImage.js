import ProgressiveCardImg from './ProgressiveCardImg';
import {FormGroup} from 'reactstrap';
import React, { Component } from 'react';
import UploadImageButton from './UploadImageButton';
import Gallery from 'react-grid-gallery'
import Button from '@material-ui/core/Button';
import {updateMessageImageURL} from './MessageDB';

class MessageDetailViewImage extends Component {
   constructor(props) {
        super(props);
        var key = this.props.messageUUID;
        this.state = {
            key: key,
            url: null,
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
    if(this.props.messageUUID  != null  && this.state.imageURL  != null  && this.state.publicImageURL){
      updateMessageImageURL(this.props.messageUUID, this.state.imageURL, this.state.publicImageURL, this.state.thumbnailImageURL, this.state.thumbnailPublicImageURL);
      this.setState({url: this.state.publicImageURL});
    }
   }

  render() {
    if((this.props.gallery !== undefined && this.props.gallery !== null) && this.props.gallery.length > 1) {
      const images = this.props.gallery.map((entry) => {
        return {src:entry.publicImageURL, thumbnail: entry.thumbnailPublicImageURL, caption: entry.caption};
      });
      return (
        <div style={{
          display: "block",
          minHeight: "1px",
          width: "100%",
          border: "1px solid #ddd",
          overflow: "visible",
          textAlign: "center",
          background: "white"
      }}>
        <Gallery
            images={images}
            rowHeight={128}
            maxRows={2}
            enableImageSelection={false}/>
        </div>
      );
    } else {
      let url = (this.state.url || this.props.url);
      if(url  != null ) {
        return (<ProgressiveCardImg src={url}/>);
      } else {
        return (
          <React.Fragment>
            <center>
              <br/>
              <h1>沒有圖片</h1>
              <br/>
              <FormGroup>
              <br/>
              <UploadImageButton ref={(uploadImageButton) => {this.uploadImageButton = uploadImageButton;}} path={this.state.key} uploadFinish={(imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL) => {this.uploadFinish(imageURL, publicImageURL, thumbnailImageURL, thumbnailPublicImageURL);}}/>
              </FormGroup>
              <Button variant="raised" color="primary" onClick={() => this.onSubmit()}>提交</Button>
            </center>
          </React.Fragment>
        );
      }
    }
  }
}

export default MessageDetailViewImage;
