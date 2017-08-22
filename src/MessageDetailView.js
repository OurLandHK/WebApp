import * as firebase from 'firebase';
import React, { Component } from 'react';
import { CardActions, CardContent, CardMedia} from 'material-ui/Card';
import ProgressiveCardImg from './ProgressiveCardImg';
import IconButton from 'material-ui/IconButton';
import Collapse from 'material-ui/transitions/Collapse';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ForumIcon from 'material-ui-icons/Forum';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import red from 'material-ui/colors/red';
import FavoriteIcon from 'material-ui-icons/Favorite';
import ShareIcon from 'material-ui-icons/Share';
import EventMap from './REventMap';
import ChipArray from './ChipArray';

const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  media: {
    height: 960,
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  flexGrow: {
    flex: '1 1 auto',
  },
});


class MessageDetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {expanded: false, rotate: 'rotate(0deg)'};
  }

  handleExpandClick() {
    this.setState({ expanded: !this.state.expanded });
/*    if(this.state.expanded) {
        this.setState({ rotate: 'rotate(180deg)' });
    } else {
        this.setState({ rotate: 'rotate(0deg)' });
    }*/
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
                    <IconButton aria-label="Add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="Share">
                        <ShareIcon />
                    </IconButton>
                    <div className={classes.flexGrow} />
                    <IconButton
                        className={classnames(classes.expand, {
                            [classes.expandOpen]: this.state.expanded,
                        })}
                        onClick={() => this.handleExpandClick()}
                        aria-expanded={this.state.expanded}
                        aria-label="Show more"
                        >
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
                        <Grid item align='center'>
                        <ProgressiveCardImg width={window.innerWidth * 0.85} gs_src={m.imageUrl}/>    
                        </Grid>
                    </Grid>   
                    <Grid container>  
                        <Grid item align='center'>
                            <CardContent>
                                <EventMap center={geolocation} zoom={zoom}/>
                            </CardContent>
                        </Grid>
                    </Grid>                       
                </Collapse>                      
            </div>);                     
        } else {
        return(
        <div>          
            <CardActions disableActionSpacing>
                <IconButton aria-label="Add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="Share">
                    <ShareIcon />
                </IconButton>
                <div className={classes.flexGrow} />
                <IconButton
                    className={classnames(classes.expand, {
                        [classes.expandOpen]: this.state.expanded,
                    })}
                    onClick={() => this.handleExpandClick()}
                    aria-expanded={this.state.expanded}
                    aria-label="Show more"
                    >
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
                    <Grid item align='center'>
                        <CardContent>
                            <EventMap center={geolocation} zoom={zoom}/>
                        </CardContent> 
                    </Grid>
                </Grid>                       
             </Collapse>
        </div>);    
        }                 
    }
}

export default withStyles(styles) (MessageDetailView);