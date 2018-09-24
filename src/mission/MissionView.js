// 3rd Party Library
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper';

import {connect} from "react-redux";

// Ourland
import {fetchBookmarkList, getUserProfile, getAddressBook} from '../UserProfile';
import ShareDrawer from '../ShareDrawer';
import {checkImageExists} from '../util/http';
import {constant} from '../config/default';
import {trackEvent} from '../track';

const styles = theme => ({
  paper: {},
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  container: {
   overflowY: 'auto'
  },
  auther: {
    //    marginBottom: 16,
        fontSize: 14,
        color: theme.palette.text.secondary,
    //    textOverflow: 'ellipsis',
    },
      title: {
    //      textOverflow: 'ellipsis',
        
      },
      summaryGrid: {
        display: 'inline-grid',
        padding: '8px',
        textOverflow: 'ellipsis',
      },
      thumbnailGrid: {
        padding: '8px'
      },
    
});

function Transition(props) {
    return <Slide direction="left" {...props} />;
  }
  
  function runTaskCheckingFunction(name, userProfile, bookmarkList, addressLis)
  {
      var fn = window[name];
      if(typeof fn !== 'function')
          return;
  
      return fn.apply(window, userProfile, bookmarkList, addressLis);
  }
  
  const taskCheckingFunction = ['singleInput', 'fiveInput', 'tenInput']; //, 'fiveInput', 'tenInput'];
  
  const taskCriterias = [
                          {
                              taskname: "SingleInput",
                              desc: "Publish for 1 Post",
                              checkObjectinUserPorilfe: "publishMessages",
                              checkField: "length",
                              passCritera: "greater",
                              threshold: 1,
                              badgeName: "FirstTime",
                              badgeImage: "/images/squareLogo.jpg",
                          },
                          {
                              taskname: "FiveInput",
                              desc: "Publish for 5 Post",
                              checkObjectinUserPorilfe: "publishMessages",
                              checkField: "length",
                              passCritera: "greater",
                              threshold: 5,
                              badgeName: "FiveTime",
                              badgeImage: "/images/squareLogo.jpg",
                          },
                          {
                              taskname: "TenInput",
                              desc: "Publish for 10 Post",
                              checkObjectinUserPorilfe: "publishMessages",
                              checkField: "length",
                              passCritera: "greater",
                              threshold: 10,
                              badgeName: "TenTime",
                              badgeImage: "/images/squareLogo.jpg",
                          }                        
                      ];
  
  function addressInputed(userProfile, bookmarkList, addressLis) {
  
  }

class MissionView extends React.Component {
  constructor(props) {
    super(props);
    let userProfile = null;
    let bookmarkList = [];
    let addressList = [];
    if(this.props.userProfile) {
        userProfile = this.props.userProfile;
    }
    if(this.props.bookmarkList) {
        bookmarkList = this.props.bookmarkList;
    }
    if(this.props.addressList) {
        addressList = this.props.addressList;
    }
    this.state = {userProfile: userProfile, bookmarkList: bookmarkList, addressList: addressList, open: false};
    this.onBackButtonEvent = this.onBackButtonEvent.bind(this);
  }

  onBackButtonEvent(e) {
    e.preventDefault();
    this.handleRequestClose();
  }

  componentDidMount() {
    if (this.props.user  !== undefined && this.props.user  !== null) {
      if(this.props.userProfile===null) {
        this.fetchUserProfile(this.props.user);
      }
    }
  }

  fetchUserProfile(user) {
    this.setState({userProfile: null});
    getUserProfile(user).then((userProfile)=>{
      fetchBookmarkList(user).then((bookmarkList)=>{
        getAddressBook(user).then((addressList)=>{
            this.setState({user: user, userProfile: userProfile, bookmarkList: bookmarkList, addressList: addressList});
        });
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user !== this.props.user && this.props.user) {
      this.fetchUserProfile(this.props.user);
    }
  }


  handleRequestClose = () => {
//    window.history.pushState("", "", `/`)
    window.onpopstate = this.lastOnPopState;
    this.setState({open: false});
  };

  // find last mission isn't complete
  renderHighlightMission(taskList) {
    const { classes } = this.props;
    let rv = null;
    if(this.state.userProfile) {
        taskList.map((task) => {
            if(task.status != "done") {
                rv = this.renderTaskCard(task);
            }
        })
    } 
    return rv;
  }

  renderTaskCard(task) {
    const classes = this.props.classes;
    console.log(task);
    let summary = <Grid className={classes.summaryGrid} item xs>
                      <Typography noWrap='true' className={classes.title} variant="title"> {task.taskname}: {task.status}</Typography>
                      <Typography className={classes.auther}>{task.desc}</Typography>
                  </Grid>
    let thumbnail = <Grid item className={classes.thumbnailGrid}><CardMedia className={classes.cover}  image={task.badgeImage}/> </Grid>
    return ( <Paper className={classes.paper}>
              <Grid container spacing={0}>
              {thumbnail}
              {summary}
              </Grid>
            </Paper>);

  }

  taskChecking() {
      let rv = [];
      let userProfileTasks = taskCriterias.map((taskCriteria) => {
            let task = {
                taskname: taskCriteria.taskname,
                desc: taskCriteria.desc,
                badgeName: taskCriteria.badgeName,
                badgeImage: taskCriteria.badgeImage,
            }
            let validateObject = this.state.userProfile[taskCriteria.checkObjectinUserPorilfe];
            let currentStatus = validateObject[taskCriteria.checkField];
            
            switch(taskCriteria.passCritera) {
                case 'greater':
                    if(currentStatus >= taskCriteria.threshold) {
                        task.status = "Done";
                    } else {
                        task.status = `${currentStatus}/${taskCriteria.threshold}`;
                    }
                    break;
                default:
                    task.status = `${currentStatus}/${taskCriteria.threshold}`;                
            }    
            return task;
      });
      rv = rv.concat(userProfileTasks);
      console.log(rv);
      return rv;
  }

  render() {
    var displayName = "...";
    let imageHtml = "等一下";
    let taskHtml = null;

    let taskList = [];
    let card = null;
    if(this.state.userProfile) {
        taskList = this.taskChecking();
        card = this.renderHighlightMission(taskList);
    }

    const { classes} = this.props;
    let dialogOpen = this.state.open;
    if(dialogOpen) {
        taskHtml = taskList.map((task) => {
            return(this.renderTaskCard(task));
        })
/*        
      if(window.onpopstate !== this.onBackButtonEvent) {
        window.history.pushState("", "", `/user/${userid}`)
        this.lastOnPopState = window.onpopstate;
        window.onpopstate = this.onBackButtonEvent;
      }
*/      
    }
    return (
      <React.Fragment>
        {card}
        <Dialog fullScreen  open={dialogOpen} onRequestClose={this.handleRequestClose} transition={Transition} unmountOnExit>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                  <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>{constant.publicProfileLabel}</Typography>
            </Toolbar>
          </AppBar>
          <div className={classes.container}>
            {taskHtml}
          </div>
        </Dialog>
      </React.Fragment>);
  }
}

MissionView.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MissionView));
