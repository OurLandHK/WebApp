// 3rd Party Library
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import CardMedia from '@material-ui/core/CardMedia';
import ListItemText from '@material-ui/core/ListItemText';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import DoneAll from '@material-ui/icons/DoneAll';
import {connect} from "react-redux";

// Ourland
import {fetchBookmarkList, getUserProfile, getAddressBook} from '../UserProfile';
import {constant, addressEnum} from '../config/default';
import {trackEvent} from '../track';

const styles = theme => ({
  paper: {},
  appBar: {
    position: 'relative',
    background: 'linear-gradient(to bottom, #006fbf  50%, #014880 50%)',
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
      cover: {
        width: 64,
        height: 64,
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

  const taskCriterias = [
                          {
                              taskname: "第一次",
                              desc: "報料一次",
                              checkObjectinUserPorilfe: "publishMessages",
                              checkField: "length",
                              passCritera: "greater",
                              threshold: 1,
                              hideBeforeDone: false,
                              badgeName: "第一次",
                              badgeImage: "/images/trophy-clipart-5.png",
                          },
                          {
                            taskname: "六合彩(暫定)",
                            desc: "報料五次",
                            checkObjectinUserPorilfe: "publishMessages",
                            checkField: "length",
                            passCritera: "greater",
                            threshold: 6,
                            hideBeforeDone: false,
                            badgeName: "六合彩(暫定)",
                            badgeImage: "/images/trophy-emoji-png.png",
                          },
                          {
                            taskname: "一打(暫定)",
                            desc: "報料十二次",
                            checkObjectinUserPorilfe: "publishMessages",
                            checkField: "length",
                            passCritera: "greater",
                            threshold: 12,
                            hideBeforeDone: false,
                            badgeName: "一打(暫定)",
                            badgeImage: "/images/trophy-emoji-png-1.png",
                          },
                          {
                            taskname: "一路發(暫定)",
                            desc: "報料168次",
                            checkObjectinUserPorilfe: "publishMessages",
                            checkField: "length",
                            passCritera: "greater",
                            threshold: 168,
                            hideBeforeDone: true,
                            badgeName: "一路發(暫定)",
                            badgeImage: "/images/trophy-emoji-png-4.png",
                          },
                          {
                            taskname: "八元位(暫定)",
                            desc: "報料256次",
                            checkObjectinUserPorilfe: "publishMessages",
                            checkField: "length",
                            passCritera: "greater",
                            threshold: 256,
                            hideBeforeDone: false,
                            badgeName: "8-Bit(暫定)",
                            badgeImage: "/images/trophy-emoji-png-6.png",
                          },
                      ];

class MissionView extends React.Component {
  constructor(props) {
    super(props);
    let userProfile = null;
    let bookmarkList = [];
    let addressList = [];
    if(this.props.publicProfileView) {
        this.publicProfileView = true;
    } else {
        this.publicProfileView = false;
    }
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

  handleRequestOpen = () => {
    if(this.state.userProfile) {
        trackEvent('Mission', this.state.userProfile.displayName);
    }
    this.setState({open: true});
  }

  handleRequestClose = () => {
//    window.history.pushState("", "", `/`)
    window.onpopstate = this.lastOnPopState;
    this.setState({open: false});
  };

  // find last mission isn't complete
  renderHighlightMission(taskList) {
    let rv = null;
    let done = 0;
    if(this.state.userProfile) {
        taskList.map((task) => {
            if(task.status !== constant.missionDone) {
                if(!rv) {
                    rv = this.renderTaskCard(task);
                }
            } else {
                done++;
            }
            return;
        })
    }
    if(this.publicProfileView) {
        rv =
          <ListItem button>
            <ListItemIcon>
                <DoneAll />
                </ListItemIcon>
              <ListItemText primary={`${constant.missionComplete}:: ${done}`} />
          </ListItem>
    }
    return rv;
  }

  renderTaskCard(task) {
    const classes = this.props.classes;
//    console.log(task);
    let summary = <Grid className={classes.summaryGrid} item xs>
                      <Typography noWrap={true} className={classes.title} variant="title"> {task.taskname}: {task.status}</Typography>
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
      // check for addressBook
      let addressStatus = '未輸入';
      this.state.addressList.map((address) => {
        //  console.log(address);
        if(address.type === addressEnum.home || address.type === addressEnum.office) {
            if(address.geolocation) {
                addressStatus = constant.missionDone;
            }
        }
        return;
      });
      let addressTask = {
        taskname: "設定地址",
        desc: "設定住宅或工作的地址",
        badgeName: "有腳既雀仔",
        badgeImage: "/images/SquareLogo.png",
        status: addressStatus,
    }
      rv.push(addressTask);
      // check for userProfileTasks
      let userProfileTasks = taskCriterias.map((taskCriteria) => {
            let validateObject = this.state.userProfile[taskCriteria.checkObjectinUserPorilfe];
            let status = `0/${taskCriteria.threshold}`;
            if(validateObject) {
                let currentStatus = validateObject[taskCriteria.checkField];
                switch(taskCriteria.passCritera) {
                    case 'greater':
                        if(currentStatus >= taskCriteria.threshold) {
                            status = constant.missionDone;
                        } else {
                            status = `${currentStatus}/${taskCriteria.threshold}`;
                        }
                        break;
                    default:
                        status = `${currentStatus}/${taskCriteria.threshold}`;
                }
            }
            let taskname = taskCriteria.taskname;
            let desc = taskCriteria.desc;
            let badgeName = taskCriteria.badgeName;
            let badgeImage = taskCriteria.badgeImage;
            if(status !== constant.missionDone) {
                badgeImage = "/images/secret.png"
                badgeName = constant.secretMission;
                if(taskCriteria.hideBeforeDone) {
                    taskname = constant.secretMission;
                    desc = constant.secretMission;
                }
            }
            let task = {
                taskname: taskname,
                desc: desc,
                badgeName: badgeName,
                badgeImage: badgeImage,
                status: status,
            }
            return task;
      });
      rv = rv.concat(userProfileTasks);
//      console.log(rv);
      return rv;
  }

  render() {
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
    }
    return (
      <React.Fragment>
        <div onClick={this.handleRequestOpen}>
            {card}
        </div>
        <Dialog fullScreen  open={dialogOpen} onRequestClose={this.handleRequestClose} transition={Transition} unmountOnExit>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                  <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>{constant.mission}</Typography>
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
