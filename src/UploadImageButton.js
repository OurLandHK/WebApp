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
    this.imageUrl = null;
    this.publicImageURL = null;
    this.thumbnailImageURL = null;
    this.publicThumbnailImagURL = null;
    this.imageUrlRef = null;
    this.thumbnailImageURLRef = null;
    this.state = {
        disableSumbit: true,
        disableDelete: true,
        open: false,
        publicThumbnailImagURL: null
    };
  }

  postImage(path, file) {
    if (validateFile(file)) {
        // Upload Event Full Image
        imageResizer(file, 1280, 1280, "image/jpeg", 0.5, function(blob) {
            uploadImage(path, "event.jpg", blob).then((snapshot) =>  {
                var fullPath = snapshot.metadata.fullPath;
//                this.imageUrlRef = firebase.storage().ref(fullPath);
                var firebaseImageURL = firebase.storage().ref(fullPath).toString();
                var publicImageURL = snapshot.downloadURL;
                imageResizer(file, 128, 128, "image/jpeg", 0.5, function(blob1) {
                    uploadImage(path, "thumbnail.jpg", blob1).then((snapshot1) =>  {
                        var thumbnailFullPath = snapshot1.metadata.fullPath;
                        //this.thumbnailImageURLRef = firebase.storage().ref(thumbnailFullPath);
                        var thumbnailFirebaseImageURL = firebase.storage().ref(thumbnailFullPath).toString();
                        var thumbnailPublicImageURL = snapshot1.downloadURL;
                        this.imageUrl = firebaseImageURL;
                        this.publicImageURL = publicImageURL;
                        this.thumbnailImageURL = thumbnailFirebaseImageURL;
                        this.publicThumbnailImagURL = thumbnailPublicImageURL;
                        this.setState({publicThumbnailImagURL: this.publicThumbnailImagURL});
                        console("uploadFinish: " + this.imageUrl + " " + this.publicImageURL+ " " + this.thumbnailImageURL+ " " + this.thumbnailPublicImageURL)

                        if(this.props.uploadFinish != null) {
                            this.props.uploadFinish(this.imageUrl, this.publicImageURL, this.thumbnailImageURL, this.thumbnailPublicImageURL);
                        }
                    });
                });                
            });
        });
    } else  {
        console.log("Not Image/No Image");
        this.imageUrl = null;
        this.publicImageURL = null;
        this.thumbnailImageURL = null;
        this.publicThumbnailImagURL = null;
    }
  };

  handleClickOpen(){
    if(this.props.path != null) {
        this.setState({ open: true, disableSumbit: true});
    }
  };

  onDelete(){
    // delete
    // Delete the file
    if(this.imageUrlRef != null) {
      this.imageUrlRef.delete().then(function() {
        this.imageUrlRef = null;
        this.thumbnailImageURLRef.delete().then(function() {
          this.thumbnailImageURLRef = null;
          if(this.props.uploadFinish != null) {
            this.props.uploadFinish(null, null, null, null);
          }
        }).catch(function(error) {
          // Uh-oh, an error occurred!
        });
        // File deleted successfully
      }).catch(function(error) {
        // Uh-oh, an error occurred!
      });
    }
    
    this.setState({ disableSumbit: true, disableDelete: true});     
    this.setState({ open: false });
  };  

  handleRequestClose(){
    this.setState({ open: false });
  };

  onSubmit(){
    this.setState({ open: false });
    if(this.props.path != null) {
        this.postImage(this.path, this.file.files[0]);
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
      thumbnail = <img src={this.state.publicThumbnailImagURL}/>
    }
    return (
      <div>
        {thumbnail}
        <Button variant="raised" color="primary" className={classes.uploadButton} raised={true} onClick={() => this.handleClickOpen()}>
            <FileUploadIcon />
                上載相片
        </Button>
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
