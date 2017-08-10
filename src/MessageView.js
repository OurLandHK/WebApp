import * as firebase from 'firebase';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card, { CardActions, CardContent, CardMedia , CardHeader, CardText, CardTitle} from 'material-ui/Card';
import ProgressiveCardImg from './ProgressiveCardImg';
import getLocation from './Location';
import distance from './Distance.js';
import IconButton from 'material-ui/IconButton';
import Collapse from 'material-ui/transitions/Collapse';
import Icon from 'material-ui/Icon';
import classnames from 'classnames';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import red from 'material-ui/colors/red';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Grid from 'material-ui/Grid';

const styleSheet = createStyleSheet(theme => ({
  card: {
    maxWidth: 400,
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
}));

class MessageView extends Component {
  constructor(props) {
    super(props);
    this.state = {lat: 0, lon: 0, expanded: false};
    this.successCallBack = this.successCallBack.bind(this);
  }

  componentDidMount() {
    getLocation(this.successCallBack, this.errorCallBack, this.notSupportedCallback);
  }

  notSupportedCallBack() {
    console.log('Disabled');
  }

  successCallBack(pos) {
    console.log('Your current position is:');
    console.log('Latitude : ' + pos.coords.latitude);
    console.log('Longitude: ' + pos.coords.longitude);
    console.log('More or less ' + pos.coords.accuracy + 'meters.'); 
    this.setState({ lat: pos.coords.latitude, lon: pos.coords.longitude}); 
  }

  errorCallBack(error) {
    console.warn('ERROR(${err.code}): ${err.message}');
  }

  handleExpandClick() {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const classes = this.props.classes;
    var m = this.props.message;
    console.log(m);
    var locationSpan = "";
    var distanceSpan = "Distance: ";
    if (m.latitude) {
      locationSpan = m.latitude + ',' + m.longitude + ' ' ;
      if (this.state.lat) {
        var dis = distance(m.longitude,m.latitude,this.state.lon,this.state.lat);
        var dist;
        if (dis > 1)
          dist = Math.round(dis) + "km";
        else
          dist = (dis * 1000) + "m";
        distanceSpan = dist;
        locationSpan += dist;
      }
    }
    var photoUrl = '/images/profile_placeholder.png';
    var date = new Date(m.createdAt);
    var subtitle = 'Geo: ' + locationSpan + '\n Created At: ' + date.toGMTString();
    if (m.photoUrl) {
      photoUrl = m.photoUrl;
    }
    if(m.imageUrl)
    {
      return (<div>
                <Card >                   
                  <CardHeader
                    title={m.text}
                    subheader={distanceSpan}
                  >
                  </CardHeader>
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
                            {subtitle}
                          </Typography>
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
                  </Collapse>                     
                </Card>
                <br/>
              </div>);
    } else {
      return (<div>                  
                <Card >                   
                  <CardHeader
                    title={m.text}
                    subheader={distanceSpan}
                  >
                  </CardHeader>
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
                          {subtitle}
                        </Typography>
                        <Typography component="p">
                          {m.fbpost}
                        </Typography>                      
                      </CardContent>
                    </Grid>  
                    <Grid item>
                      <CardMedia
                        overlay={m.name}>
                        <img src={photoUrl} />
                        {m.name}
                      </CardMedia>
                    </Grid> 
                   </Grid>   
                  </Collapse>                     
                </Card>
                <br/>
              </div>);              
    }
  }
}

MessageView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(MessageView);
//export default MessageView;