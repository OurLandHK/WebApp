import * as firebase from 'firebase';
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied'; 
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied'; 
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import FavoriteButton from './FavoriteButton';
import BookmarkToggleButton from './bookmark/BookmarkToggleButton';
import {setHappyAndSad} from './MessageDB';
import FocusToggleButton from './admin/FocusToggleButton';
import {
  updatePublicProfileDialog,
} from './actions';
import {connect} from 'react-redux';
import { constant, happyAndSadEnum, RoleEnum } from './config/default';

const styles = theme => ({
  button: {
    borderRadius: 0,
    width: '64px',
    height: '64px'
  },
  paper: {

  },
  authorContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  authorGrid: {
    alignItems: 'center',
    alignContent: 'center',
    
    padding: '8px'
  },
  container: {
    overflowY: 'auto'
  },
  actionContainer: {
    display: 'flex',
    height: '5rem',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


class MessageAction extends Component {
  constructor(props) {
    super(props);
    let happyCount = 0;
    let sadCount = 0;
    let m = this.props.message;
    if(m.happyCount) {
      happyCount = m.happyCount;
    }
    if(m.sadCount) {
      sadCount = m.sadCount;
    }
    this.state = {
        happyAndSad: this.props.happyAndSad,
        happyCount: happyCount,
        sadCount: sadCount
      };
    this.handleHappySadClick = this.handleHappySadClick.bind(this);
  }

  handleHappySadClick(happySadValue) {
    let happyCount = this.state.happyCount;
    let sadCount = this.state.sadCount;
    let happyAndSadValue = happySadValue;
    switch(this.state.happyAndSad) {
      case happyAndSadEnum.nothing:
        if(happySadValue > happyAndSadEnum.nothing) {
          happyCount++;
        } else {
          sadCount++;
        }
        break;
      case happyAndSadEnum.happy:
        happyCount--;
        if(happySadValue < happyAndSadEnum.nothing) {
          sadCount++;
        } else {
          happyAndSadValue = happyAndSadEnum.nothing;
        }      
        break;
      case happyAndSadEnum.sad:
        sadCount--;
        if(happySadValue > happyAndSadEnum.nothing) {
          happyCount++;
        } else {
          happyAndSadValue = happyAndSadEnum.nothing;
        }
        break;
    }
    setHappyAndSad(this.props.message.key, happyCount, sadCount, happyAndSadValue, this.props.user.user)
    this.setState({
      happyAndSad: happyAndSadValue,
      happyCount: happyCount,
      sadCount: sadCount
    })
  }

  render() {
    const { classes, user } = this.props;
    let m = this.props.message;
    let happyCount = this.state.happyCount;
    let sadCount = this.state.sadCount;
    let happyColor = "";
    let sadColor = "";
    let focusButton = null;
    switch(this.state.happyAndSad) {
      case happyAndSadEnum.happy: 
        happyColor = "secondary";
        break;
      case happyAndSadEnum.sad:
        sadColor = "primary";
        break;
    }
    let disable=true;
    if(this.props.user != null && this.props.user.user != null) {
      disable = false;
    }
    if (user.userProfile != null & (user.userProfile.role == RoleEnum.admin || user.userProfile.role == RoleEnum.monitor)) {
      focusButton =  <Grid item ><FocusToggleButton message={m}/></Grid>;
    } 
    return(<Paper role="button" >
        <Grid container className={classes.actionContainer} spacing={16}>
        <Grid item className={classes.authorGrid}> 
            <IconButton
                        className={classes.button}
                        disabled={disable}
                        color={happyColor}   
                        onClick={() => this.handleHappySadClick(happyAndSadEnum.happy)}                     
                        >
              <SentimentSatisfiedIcon />
              : {happyCount}
            </IconButton>            
          </Grid> 
          <Grid item className={classes.authorGrid}> 
            <IconButton
                        className={classes.button}
                        disabled={disable}
                        color={sadColor}
                        onClick={() => this.handleHappySadClick(happyAndSadEnum.sad)}                        
                        >
              <SentimentDissatisfiedIcon/>
              : {sadCount}
            </IconButton>
          </Grid>  
        <Grid item >
          <BookmarkToggleButton message={m}/>    
        </Grid>
        {focusButton}
      </Grid>
  </Paper>);
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updatePublicProfileDialog:
      (userId, fbuid, open) =>
        dispatch(updatePublicProfileDialog(userId, fbuid, open)),
  }
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)
(withStyles(styles)((MessageAction)));
