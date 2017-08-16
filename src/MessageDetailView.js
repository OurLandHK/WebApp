import * as firebase from 'firebase';
import React, { Component } from 'react';
import Card, { CardActions, CardContent, CardMedia , CardHeader, CardText, CardTitle} from 'material-ui/Card';
import ProgressiveCardImg from './ProgressiveCardImg';
import IconButton from 'material-ui/IconButton';
import Collapse from 'material-ui/transitions/Collapse';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Grid from 'material-ui/Grid';
import EventMap from './REventMap';

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
    var zoom=16;
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
                    <Typography component="p">
                    {m.fbpost}
                    </Typography>                      
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
                    <Typography component="p">
                    {m.fbpost}
                    </Typography>                      
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