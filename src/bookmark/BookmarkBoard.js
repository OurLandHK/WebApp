
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tab  from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Slide from '@material-ui/core/Slide';
import {connect} from "react-redux";
import {constant} from '../config/default';
import BookmarkList from './BookmarkList';
import BookmarkView from './BookmarkView';
import {
  checkAuthState,
} from '../actions';

function Transition(props) {
  return <Slide direction="left" {...props} />;
}

const styles = {
    appBar: {
      position: 'relative',
    },
    flex: {
      flex: 1,
    },
    container: {
       overflowY: 'auto'
    },
    media: {
      color: '#fff',
      position: 'relative',
      height: '10rem',
    },
    mediaCredit: {
      position:'absolute',
      bottom:'0',
      right:'0',
      fontSize:'0.5rem',
    }
  };

class BookmarkBoard extends React.Component {
  constructor(props) {
//    console.log("createEventListDialog");
    super(props);
    this.state = {
      tabValue: constant.myBookmarkLabel,
    };
  }

  componentWillMount() {
    this.props.checkAuthState();
  }

  handleChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  renderMessages() {
    const { classes, user } = this.props;
    return (
      <div className={classes.container}>
        <BookmarkList bookmarkList={user.bookmarkList}/>
      </div>
    );
  }


  render() {
    const { classes, user} = this.props;
    const { tabValue } = this.state;
    return (
      <div class="bookmakrboard-wrapper">
        <div class="tabs-row">
          <Tabs
            value={tabValue}
            onChange={this.handleChange}
            fullWidth
          >
            <Tab label={constant.myBookmarkLabel} value={constant.myBookmarkLabel}/>
            <Tab label={constant.publicBookmarkLabel} value={constant.publicBookmarkLabel}/>
            <BookmarkView/>
          </Tabs>
        </div>
        {tabValue === constant.myBookmarkLabel && this.renderMessages()}
      </div>);
  }
}

BookmarkBoard.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    user          :   state.user,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthState:
      () => dispatch(checkAuthState()),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BookmarkBoard));
