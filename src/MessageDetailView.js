import * as firebase from 'firebase';
import React, { Component } from 'react';
import Card, { CardActions, CardContent, CardMedia , CardHeader, CardText, CardTitle} from 'material-ui/Card';
import ProgressiveCardImg from './ProgressiveCardImg';
import IconButton from 'material-ui/IconButton';
import Collapse from 'material-ui/transitions/Collapse';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ForumIcon from 'material-ui-icons/Forum';
import Grid from 'material-ui/Grid';
import EventMap from './REventMap';
import ChipArray from './ChipArray';

class MessageDetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {expanded: false};
  }

  handleExpandClick() {
    this.setState({ expanded: !this.state.expanded });
  };


  render() {
    const classes = this.props.classes;
    var m = this.props.message;
    var tag = m.tag;
    var chips = [];
    if(Array.isArray(tag))
    {
        for (var i = 0; i < tag.length; i++) { 
            var chip = {key:i, label:tag[i]};
            chips.push(chip);
        }
    }
    var facebookURL = "https://facebook.com/" + m.fbpost;
    console.log('facebookURL: '+facebookURL);
    var zoom=15;
    var photoUrl = '/images/profile_placeholder.png';
    var geolocation = {lat: m.latitude, lng: m.longitude};
    if (m.photoUrl) {
      photoUrl = m.photoUrl;
    }    
    if(m.imageUrl)
    {
      return(
          <div>
        <CardActions disableActionSpacing>
            <IconButton onClick={() => this.handleExpandClick()}>
                <ExpandMoreIcon />
            </IconButton> 
        </CardActions>                  
        <Collapse in={this.state.expanded} transitionDuration="auto" unmountOnExit>
            <Grid container>
                <Grid item>                  
                    <CardContent>
                        <IconButton href={facebookURL} data-scheme="fb://profile/10000">
                            <ForumIcon />
                        </IconButton>                         
                    </CardContent>  
                </Grid>  
                <Grid item>
                    <CardMedia
                    overlay={m.name}>
                    <img src={photoUrl} />
                    <Typography component="p">
                        {m.name}
                    </Typography>
                    </CardMedia>
                </Grid>
                <Grid item>
                    <ChipArray chipData={chips} />
                </Grid>
            </Grid>
            <Grid container>  
                <Grid item>
                <ProgressiveCardImg gs_src={m.imageUrl}/>    
                </Grid>
            </Grid>   
            <Grid container>  
                <Grid item>
                <EventMap center={geolocation} zoom={zoom}/>    
                </Grid>
            </Grid>                       
        </Collapse>
        </div>);                     
        } else {
        return(
            <div>
            <CardActions disableActionSpacing>
            <IconButton onClick={() => this.handleExpandClick()}>
                <ExpandMoreIcon />
            </IconButton> 
            </CardActions>                  
            <Collapse in={this.state.expanded} transitionDuration="auto" unmountOnExit>
            <Grid container>
                <Grid item>                  
                    <CardContent>
                        <IconButton href={facebookURL} data-scheme="fb://profile/10000">
                            <ForumIcon />
                        </IconButton>                         
                    </CardContent>  
                </Grid>  
                <Grid item>
                    <CardMedia overlay={m.name}>
                        <img src={photoUrl} />
                        <Typography component="p">
                            {m.name}
                        </Typography>
                    </CardMedia>
                </Grid>
                <Grid item>
                    <ChipArray chipData={chips} />
                </Grid>
            </Grid>  
            <Grid container>  
                <Grid item>
                <EventMap center={geolocation} zoom={zoom}/>    
                </Grid>
            </Grid>                       
        </Collapse>
        </div>);    
        }                 
    }
}

export default MessageDetailView;