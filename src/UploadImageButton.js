import React, { Component } from 'react';
import * as firebase from 'firebase';
import config from './config/default';
import { Form, Label, Input} from 'reactstrap';
import { FormGroup, FormControlLabel, FormText, FormControl } from 'material-ui/Form';
import Button  from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import FileUploadIcon from 'material-ui-icons/FileUpload';
import imageResizer from './ImageResizer';

const styles = theme => ({
    hidden: {
      display: 'none',
    },
    dialogTitle: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'  
    },
    previewThumbnail: {
      width: '128px',
      height: '128px'
    }
  });

function validateFile(file) {
  if (! file) {
    console.log("file not exist: " + file); 
    return false;    
  }

  if(!file.type.match('image.*')) {
    console.log("File is not image:" + file);
    var data = {
      message: 'You can only share images',
      timeout: 2000
    };
    //TODO: call snackbar
    //this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
    return false;
  }
  return true;
};

function uploadImage(messageKey, filename, blob) {
  var filePath = config.photoDB + '/' + messageKey + '/' + filename;
  var storage = firebase.storage();
  return storage.ref(filePath).put(blob);  
};



class UploadImageButton extends Component {
  constructor(props) {
    super(props);
    this.imageURL = null;
    this.publicImageURL = null;
    this.thumbnailImageURL = null;
    this.publicThumbnailImagURL = null;
    this.imageUrlRef = null;
    this.thumbnailImageURLRef = null;
    this.thumbnailFile = null;
    this.state = {
        disableSumbit: true,
        disableDelete: true,
        open: false,
        publicThumbnailImagURL: null
    };
    this.pushOriginal = this.pushOriginal.bind(this);
    this.pushThumbnail = this.pushThumbnail.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.defaultOriginal = "original.jpg";
    this.defaultThumbnail = "thumbnail.jpg";
    this.isOriginalOnly = false;
    this.isThumbnailOnly = false;
    if(this.props.isOriginalOnly == true) {
      this.isOriginalOnly = true;
    }
    if(this.props.isThumbnailOnly == true) {
      this.isThumbnailOnly = true;
    }
    
  }

  postImage() {
    if (validateFile(this.file.files[0])) {
      this.thumbnailFile = this.file.files[0];
        // Upload Event Full Image
        if(this.isThumbnailOnly){
          imageResizer(this.thumbnailFile, 128, 128, "image/jpeg", 0.5, this.pushThumbnail); 
        } else {
          imageResizer(this.file.files[0], 1280, 1280, "image/jpeg", 0.5, this.pushOriginal);
        }
    } else  {
        console.log("Not Image/No Image");
        this.imageURL = null;
        this.publicImageURL = null;
        this.thumbnailImageURL = null;
        this.publicThumbnailImagURL = null;
    }
  };

pushOriginal(blob) {
    var file = (this.props.originalFilename==null? this.defaultOriginal: this.props.originalFilename);
    uploadImage(this.props.path, file, blob).then((snapshot) =>  {
        var fullPath = snapshot.metadata.fullPath;
        this.imageUrlRef = firebase.storage().ref(fullPath);
        var firebaseImageURL = firebase.storage().ref(fullPath).toString();
        var publicImageURL = snapshot.downloadURL;
        this.imageURL = firebaseImageURL;
        this.publicImageURL = publicImageURL;
        if(!this.isOriginalOnly){
          imageResizer(this.thumbnailFile, 128, 128, "image/jpeg", 0.5, this.pushThumbnail);
        }else{
          this.setState({publicThumbnailImagURL: this.publicImageURL});
          if(this.props.uploadFinish != null) {
            this.props.uploadFinish(this.imageURL, this.publicImageURL, this.thumbnailImageURL, this.publicThumbnailImagURL);
          }
        }
    });
};

  pushThumbnail(blob) {
    var filename = (this.props.thumbnailFilename==null? this.defaultThumbnail: this.props.thumbnailFilename);
    uploadImage(this.props.path, filename, blob).then((snapshot) =>  {
        var thumbnailFullPath = snapshot.metadata.fullPath;
        this.thumbnailImageURLRef = firebase.storage().ref(thumbnailFullPath);
        var thumbnailFirebaseImageURL = firebase.storage().ref(thumbnailFullPath).toString();
        var thumbnailPublicImageURL = snapshot.downloadURL;
        this.thumbnailImageURL = thumbnailFirebaseImageURL;
        this.publicThumbnailImagURL = thumbnailPublicImageURL;
        this.setState({publicThumbnailImagURL: this.publicThumbnailImagURL});
        if(this.props.uploadFinish != null) {
            this.props.uploadFinish(this.imageURL, this.publicImageURL, this.thumbnailImageURL, this.publicThumbnailImagURL);
        }
    });
}

  handleClickOpen(){
    if(this.props.path != null) {
        this.setState({ open: true, disableSumbit: true});
    }
  };

  onDelete(){
    // delete
    // Delete the file
    if(this.imageUrlRef != null) {
      console.log('delete image: '+ this.imageUrlRef);
      this.imageUrlRef.delete();
      this.imageUrlRef = null;
    }
    if(this.thumbnailImageURLRef != null) {
      console.log('delete thumbnailImage: '+ this.thumbnailImageURLRef);
      this.thumbnailImageURLRef.delete();
      this.thumbnailImageURLRef = null;
    }
    if(this.props.uploadFinish != null) {
      this.props.uploadFinish(null, null, null, null);
    }
    this.setState({ disableSumbit: true, disableDelete: true, publicThumbnailImagURL: null, open: false });     
  };  

  handleRequestClose(){
    this.setState({ open: false });
  };

  onSubmit(){
    this.setState({ open: false });
    if(this.props.path != null) {
        this.postImage();
    }
  };

  inputOnchange() {
      if(this.file != null && this.file.files[0] != null && this.file.files[0] != "") {
        this.setState({ disableSumbit: false , disableDelete: false});
      } else {
        this.setState({ disableSumbit: true, disableDelete: true});   
      }
  }
  

  render() {
    const { classes, theme } = this.props;
    let thumbnail = "沒有相片";
    if(this.state.publicThumbnailImagURL != null) {
      thumbnail = <img src={this.state.publicThumbnailImagURL} className={classes.previewThumbnail}/>
    }
    return (
      <div>
        <Button variant="raised" color="primary" className={classes.uploadButton} raised={true} onClick={() => this.handleClickOpen()}>
            <FileUploadIcon />
                上載相片
        </Button>
        {thumbnail}
        <Dialog
          open={this.state.open}
          onRequestClose={() => this.handleRequestClose()}
          aria-labelledby="form-dialog-title"
        >
            <DialogTitle className={classes.dialogTitle} id="form-dialog-title">上載相片</DialogTitle>
                <DialogContent>
                    <Label for="file">相片</Label>
                        <input
                            type="file"
                            name="file"
                            id="file"
                            className={classes.hidden}
                            ref={(file) => {this.file = file;}}
                            onChange={() => this.inputOnchange()}
                        />                                       
                    <Button
                        className={classes.uploadButton}
                        variant="raised"
                        component="label"
                        htmlFor="file"
                    >
                        <FileUploadIcon />
                        選擇來源
                    </Button>
                </DialogContent>
            <DialogActions>
                <Button disabled={this.state.disableDelete} color="secondary" onClick={() => this.onDelete()} >刪除</Button>
                <Button color="primary" onClick={() => this.handleRequestClose()} >取消</Button>
                <Button disabled={this.state.disableSumbit} color="primary" onClick={() => this.onSubmit()}>提交</Button> 
            </DialogActions>
        </Dialog>                
      </div>);
  }
}

export default withStyles(styles)(UploadImageButton);
