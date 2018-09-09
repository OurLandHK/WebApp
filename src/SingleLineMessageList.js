import React, { Component } from 'react';
import {constant} from './config/default';
import MessageView from './MessageView';
import {getMessage} from './MessageDB';
import GridList from '@material-ui/core/GridList';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  scrollingWrapper: {
    overflowX: 'scroll',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  scrollingItem: {
      display: 'inline-block',
  },
});

class SingleLineMessageList extends Component {
  constructor(props) {
    super(props);
    let messageIds = [];
    let statusMessage = constant.messageListReadingLocation;
    if(this.props.messageIds  != null ) {
      messageIds = this.props.messageIds;
      statusMessage = constant.messageListLoadingStatus;
    }
    this.state = {
      data:[],
      messageIds: messageIds,
      statusMessage: statusMessage,
    };
    this.setMessage = this.setMessage.bind(this);
    this.clear = this.clear.bind(this);
  }

  componentDidMount() {
    if(this.state.messageIds.length !== 0) {
      this.refreshMessageList();
    }
  }

  componentDidUpdate(prevProps, prevState) {
  }

  refreshMessageList() {
    this.fetchMessages();
  }

  setMessage(val) {
    if(val === null) {
      this.setState({statusMessage: constant.messageListNoMessage});
      return;
    }
    this.state.data.push(val);
    this.setState({data:this.state.data});
    return
  };

  clear() {
    this.setState({data: []});
  }


  fetchMessages() {
    this.clear();
    if(this.state.messageIds.length !== 0) {
      this.state.messageIds.map((Ids) => {
        //console.log("Ids:" + Ids);
        return getMessage(Ids).then((message) => {return this.setMessage(message)});
      });
    } else {
      this.setMessage(null);
    }
  }

  render() {
    const classes = this.props.classes;
    let lon = 0;
    let lat = 0;

    if(this.state.data.length === 0) {
      let statusMessage = this.state.statusMessage;
      return(<h4>{statusMessage}</h4>);
    } else {
      let messageList = null;
      let elements = this.state.data.map((message) => {
        return (<div className={classes.scrollingItem} key={message.key}><MessageView message={message} key={message.key} tile={true} lon={lon} lat={lat}/></div>);
//          return (<MessageView message={message} key={message.key} tile={true} lon={lon} lat={lat}/>);

      });
//        return (<div className={classes.root}><GridList className={classes.gridList} cellHeight={160} cols={2.5}>{elements}</GridList></div>);
      messageList = <div className={classes.scrollingWrapper}>{elements}</div>; 
      return (<div className="message-list-wrapper">{messageList}</div>);
    }
  }
};



export default withStyles(styles)(SingleLineMessageList);
