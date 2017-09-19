import * as firebase from 'firebase';
import React, { Component } from 'react';
import { CardActions, CardContent, CardMedia} from 'material-ui/Card';
import ProgressiveCardImg from './ProgressiveCardImg';
import IconButton from 'material-ui/IconButton';
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

  };


  render() {
    const classes = this.props.classes;
    var m = this.props.message;
    var tag = m.tag;
    var chips = [];
    var date = new Date(m.start);
    var dateTimeString = date.toGMTString();
    var interval = m.interval;
    var duration = m.duration;
    var link = m.link;
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
    let linkHtml = null;
    if({link} != "") {
        linkHtml = <Grid container> <Grid item> <CardContent> <Typography component='p'> 外部連結： {link} </Typography> </CardContent> </Grid></Grid>;
    }
    let dateHtml = null;
    if(dateTimeString != "Invalid Date") { 
        dateHtml = <Grid container>
                        <Grid item><CardContent><Typography component='p'> 開始: {dateTimeString}</Typography> </CardContent> </Grid>  
                        <Grid item><CardContent><Typography component='p'> 為期: {duration} </Typography> </CardContent> </Grid>
                        <Grid item><CardContent><Typography component='p'> 週期: {interval} </Typography> </CardContent> </Grid>                
                        </Grid>;
    }   
    let imageHtml = null;    
    if(m.imageUrl){                                      
        imageHtml = <Grid container>
                        <Grid item align='center'><ProgressiveCardImg width={window.innerWidth * 0.85} gs_src={m.imageUrl}/></Grid>
                      </Grid>;
    }   
    return(<div><Grid container>
                    <Grid item> <CardContent> <IconButton href={facebookURL} data-scheme='fb://profile/10000'> <ForumIcon /> </IconButton> </CardContent> </Grid>
                    <Grid item> <CardMedia overlay={m.name}> <img src={photoUrl} /> <Typography component='p'> {m.name} </Typography> </CardMedia> </Grid>
                    <Grid item> <ChipArray chipData={chips} /> </Grid>
                </Grid>
                {linkHtml}
                {dateHtml}
                {imageHtml}
                <Grid container> <Grid item align='center'><CardContent><EventMap center={geolocation} zoom={zoom}/></CardContent></Grid></Grid>
                </div>);

    }                 
}

export default withStyles(styles) (MessageDetailView);
//export default MessageDetailView;