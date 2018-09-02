import React, { Component } from 'react';
import config, {constant} from '../config/default';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import {fetchAllUser} from '../UserProfile';
import { updatePublicProfileDialog} from '../actions';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  scrollingWrapper: {
    overflowX: 'scroll',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
  },

  scrollingItem: {
      display: 'inline-block',
  },
  container: {
    overflowY: 'auto'
  }  
});

class UserList extends Component {
  constructor(props) {
    super(props);
    let geolocation = this.props.geolocation;
    if (geolocation === null) {
      geolocation = constant.invalidLocation;
    }
    this.state = {
      distance: this.props.distance,
      geolocation: geolocation,
      data:[],
      selectedSorting: null,
    };
    this.setUser = this.setUser.bind(this);
    this.clear = this.clear.bind(this);
    this.openPublicProfileDialog = this.openPublicProfileDialog.bind(this);
  }

  componentDidMount() {
    this.refreshUserList();
  }

  componentDidUpdate(prevProps, prevState) {
  }

  refreshUserList() {
    this.setState({
      selectedSorting: null});
    this.fetchUsers(this.props.filter);
  }

  setUser(val) {
    if(val === null) {
      return;
    }
    this.state.data.push(val);
    this.setState({data:this.state.data});
  };

  clear() {
    this.setState({data: []});
  }


  fetchUsers(filter) {
    const {
     eventNumber: numberOfMessage,
     distance,
     geolocation
    } = filter;
    this.setState({geolocation: geolocation});
    this.clear();
    fetchAllUser(this.setUser);
  }

  openPublicProfileDialog(uid, fbuid) {
    const {updatePublicProfileDialog} = this.props;
    if (uid) {
      updatePublicProfileDialog(uid, fbuid, true)
    }
  };

  renderUser(user) {
    const { classes } = this.props;
    let dateTimeString = '';
    if(user.lastLogin  != null ) {
      let date = user.lastLogin.toDate();
      if(date.getFullYear() > 1970) {
        dateTimeString = date.toLocaleDateString('zh-Hans-HK', { timeZone: 'Asia/Hong_Kong' });
      }
    }
    return (
    <Card className={classes.card}>
        <CardHeader
        avatar={
            <Avatar
            className={classes.avatar}
            src={user.photoURL}
            />
        }
        title={user.displayName}
        subheader={`last login: ${dateTimeString}`}
        onClick={() => this.openPublicProfileDialog(user.uid, user.fbuid)}
        />
    </Card>
    );
  }

  render() {
    const classes = this.props.classes;
    let lon = 0;
    let lat = 0;

    if(this.state.geolocation  != null  && this.state.geolocation !== constant.invalidLocation) {
      lon = this.state.geolocation.longitude;
      lat = this.state.geolocation.latitude;
    }
    return (
        <div>
            {this.state.data.map((t, i) => {return this.renderUser(t, i + 1);})}
        </div>);
  }
};

UserList.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    filter : state.filter,
    geolocation: state.geolocation,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updatePublicProfileDialog:
      (userId, fbuid, open) =>
        dispatch(updatePublicProfileDialog(userId, fbuid, open)),
  }
};


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(UserList));
