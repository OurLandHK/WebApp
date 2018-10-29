import React, { Component } from 'react';
import {constant} from './config/default';
import MessageView from './MessageView';
import distance from './Distance';
import {getMessage, fetchMessagesBaseOnGeo} from './MessageDB';
import { fetchLocation, updateFilter, updateFilterTagList} from './actions';
import {connect} from "react-redux";
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
  messageListWrapper: {
    maxHeight: '300px'
  }
});

class MessageList extends Component {
  constructor(props) {
    super(props);
    let geolocation = constant.invalidLocation;
    if (this.props.longitude && this.props.latitude) {
      geolocation = {longitude: this.props.longitude, latitude: this.props.latitude};
    }
    let messageIds = [];
    let statusMessage = constant.messageListReadingLocation;
//    console.log("geolocation" + this.props.id + " " + geolocation.longitude);
    if(this.props.messageIds  != null ) {
      messageIds = this.props.messageIds;
      statusMessage = constant.messageListLoadingStatus;
    }
    this.state = {
//      eventId: this.props.eventId,
      eventNumber: this.props.eventNumber,
      distance: this.props.distance,
      geolocation: geolocation,
      data:[],
      messageIds: messageIds,
      selectedTag: null,
      selectedSorting: null,
      statusMessage: statusMessage,
    };
    this.updateGlobalFilter = this.updateGlobalFilter.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.clear = this.clear.bind(this);
  }

  componentDidMount() {
    console.log(`componentDidMount ${this.props.id} ${this.state.geolocation.longitude}`);
    if(this.state.messageIds.length !== 0) {
       this.refreshMessageList();
    } else if (this.state.geolocation && this.state.geolocation !== constant.invalidLocation) {
      this.updateGlobalFilter(this.state.eventNumber, this.state.distance, this.state.geolocation);
   }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.messageIds.length === 0 && (this.props.filter.geolocation !== prevProps.filter.geolocation ||
      this.props.filter.distance !== prevProps.filter.distance ||
      this.props.filter.selectedSorting !== prevProps.filter.selectedSorting ||
      this.props.tagFilter !== prevProps.tagFilter)) {
      this.refreshMessageList();
    } else {
      if(this.props.filter.selectedTag !== prevProps.filter.selectedTag) {
        this.setState({selectedTag: this.props.filter.selectedTag});
      }
      if(this.props.filter.sorting &&  this.props.filter.sorting !== prevProps.filter.sorting){
        this.setState({selectedSorting: this.props.filter.selectedSorting});
      }
    }
  }

  updateGlobalFilter(eventNumber, distance, geolocation) {
    //console.log("ML Update Filter: " + geolocation);
    const { updateFilter } = this.props;
    updateFilter(eventNumber, distance, geolocation);
  }

  refreshMessageList() {
    console.log("refreshMessageList");
    this.setState({
      selectedTag: null,
      selectedSorting: null});
    this.fetchMessages(this.props.filter);
  }

  setMessage(val) {
    if(val === null) {
      this.setState({statusMessage: constant.messageListNoMessage});
      return;
    }
    if(val.tag  !== undefined && val.tag  !== null  && val.tag.length > 0) {
      this.props.updateFilterTagList(val.tag);
    }
    this.state.data.push(val);
    this.setState({data:this.state.data});
  };

  clear() {
    console.log("clear  message list")
    this.setState({data: []});
  }


  fetchMessages(filter) {
    const {
     eventNumber: numberOfMessage,
     distance,
    } = filter;
    let geolocation = filter.geolocation;
    this.setState({geolocation: geolocation, statusMessage: constant.messageListLoadingStatus});
    //console.log("Fetch MessageIDs: " + this.state.messageIds);
    console.log("List" +geolocation);
    this.clear();
    if(this.state.messageIds.length !== 0) {
      //console.log("List" + this.state.messageIds);
      this.state.messageIds.map((Ids) => {
        //console.log("Ids:" + Ids);
        getMessage(Ids).then((message) => {this.setMessage(message)});
      });

    } else {
      switch (geolocation) {
        case constant.invalidLocation:
          //console.log("invalidLocation");
          this.setState({statusMessage: constant.messageListBlockLocation});
          break;
        case constant.timeoutLocation:
          this.setState({statusMessage: constant.messageListTimeOut});
          break;
        default:
          console.log(`fetchMessagesBaseOnGeo ${this.props.id} ${geolocation}, ${distance}, ${numberOfMessage}`);
          fetchMessagesBaseOnGeo(geolocation, distance, numberOfMessage, null, this.props.tagFilter, this.setMessage);
          break;
      }
    }
  }

  render() {
    const classes = this.props.classes;
    let lon = 0;
    let lat = 0;

    if(this.state.geolocation && this.state.geolocation !== constant.invalidLocation) {
      lon = this.state.geolocation.longitude;
      lat = this.state.geolocation.latitude;
    }

    let sorting = this.props.filter.selectedSorting;
    if(sorting === 'sortByLastUpdate'){
      this.state.data.sort((i, j) => (j.lastUpdate==null?j.createdAt.toDate():j.lastUpdate.toDate()) - (i.lastUpdate==null?i.createdAt.toDate():i.lastUpdate.toDate()));
    }else if(sorting === 'sortByDistance'){
      this.state.data.sort((i, j) => (distance(i.geolocation.longitude,i.geolocation.latitude,lon,lat))
        - (distance(j.geolocation.longitude,j.geolocation.latitude,lon,lat)));
    }

//    console.log(this.state.data.length + " " + this.props.id);

    if(this.state.data.length === 0) {
      let statusMessage = this.state.statusMessage;
      return(<h4>{statusMessage}</h4>);
    } else {
      let messageList = null;
      let elements = this.state.data.map((message) => {
        if(this.state.selectedTag  != null  && (message.tag === null || message.tag === undefined|| !message.tag.includes(this.state.selectedTag))) {
          // filter by selected tag.
          return null;
        } else {
          return (<MessageView message={message} key={message.key} tile={false} lon={lon} lat={lat}/>);
        }
      });
      messageList = elements;
      if(this.props.short) {
        return (<div className={classes.messageListWrapper}>{messageList}</div>);
      } else {
        return (<div className="message-list-wrapper">{messageList}</div>);
      }
    }
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    filter : state.filter,
    geolocation: state.geolocation,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLocation: () => dispatch(fetchLocation()),
    updateFilter:
      (eventNumber, distance, geolocation) =>
        dispatch(updateFilter(eventNumber, distance, geolocation)),
    updateFilterTagList:
        (tagList) =>
          dispatch(updateFilterTagList(tagList)),
  }
};


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MessageList));
