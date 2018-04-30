import React, { Component } from 'react';
import * as firebase from 'firebase';
import config, {constant} from './config/default';
import MessageView from './MessageView';
import distance from './Distance';
import {getMessage, fetchMessagesBaseOnGeo} from './MessageDB';
import { updateFilter, updateFilterTagList} from './actions';
import {connect} from "react-redux";


class MessageList extends Component {
  constructor(props) {
    super(props);
    let geolocation = this.props.geolocation;
    if(geolocation == null) {
      geolocation = constant.invalidLocation;
    }
    let messageIds = [];
    let statusMessage = constant.messageListReadingLocation;
//    console.log("Message List" + this.props.messageIds);
    if(this.props.messageIds != null) {  
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
      statusMessage: statusMessage
    };
    this.updateFilter = this.updateFilter.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.setMessageRef = this.setMessageRef.bind(this);
    this.clear = this.clear.bind(this);
  }

  componentDidMount() {
    if(this.state.messageIds.length != 0) {
      this.updateFilter(this.state.eventNumber, this.state.distance, this.state.geolocation);
    }
  }
 
  componentDidUpdate(prevProps, prevState) {
    if (this.props.filter.geolocation != prevProps.filter.geolocation ||
      this.props.filter.distance != prevProps.filter.distance ||
      this.props.filter.selectedSorting != prevProps.filter.selectedSorting) {
      this.refreshMessageList();
    } else {
      if(this.props.filter.selectedTag != undefined && 
            this.props.filter.selectedTag != prevProps.filter.selectedTag) {
        this.setState({selectedTag: this.props.filter.selectedTag});
      }

      if(this.props.filter.sorting != undefined &&  this.props.filter.sorting != prevProps.filter.sorting){
        this.setState({selectedSorting: this.props.filter.selectedSorting});
      }
    }
  }

  updateFilter(eventNumber, distance, geolocation) {
    //console.log("ML Update Filter: " + geolocation);
    const { updateFilter } = this.props;
    updateFilter(eventNumber, distance, geolocation);
    this.refreshMessageList();
  }

  refreshMessageList(filter) {
    if (filter == null) {
      filter = this.props.filter;
    }
    this.setState({selectedTag: null});
    this.setState({selectedSorting: null});
    this.fetchMessages(filter); 
  }

  setMessageRef(messageRef) {
    if(messageRef == null) {
      this.setState({statusMessage: constant.messageListNoMessage});
      return;
    }
    var val = messageRef.data();
    if(val) {
      if(this.props.filter.geolocation != constant.invalidLocation) {
        var lon = this.props.filter.geolocation.longitude;
        var lat = this.props.filter.geolocation.latitude;
        var dis = distance(val.geolocation.longitude,val.geolocation.latitude,lon,lat);
        if(dis < this.props.filter.distance) {
          this.setMessage(val)  
        } else {
          this.setState({statusMessage: constant.messageListNoMessage});
        }
      } else {
        this.setMessage(val)
      }
    }
  }

  setMessage(val) {
    if(val.tag != null && val.tag.length > 0) {      
      this.props.updateFilterTagList(val.tag);
    }
    if(val != null) {
      this.state.data.push(val);
      this.setState({data:this.state.data});
    } 
  };

  clear() {
    this.setState({data: []});
  }  


  fetchMessages(filter) {
    const {
     eventNumber: numberOfMessage,
     distance,
     geolocation
    } = filter;
    this.setState({geolocation: geolocation, statusMessage: constant.messageListLoadingStatus});
    //console.log("Fetch MessageIDs: " + this.state.messageIds);
    if(this.state.messageIds.length != 0) {
      this.clear();
      this.state.messageIds.map((Ids) => {
        //console.log("Ids:" + Ids);
        getMessage(Ids).then((message) => {this.setMessage(message)});
      });
    } else {
      this.clear();
      switch (geolocation) {
        case constant.invalidLocation:
          this.setState({statusMessage: constant.messageListBlockLocation});
          break;
        case constant.timeoutLocation:
          this.setState({statusMessage: constant.messageListTimeOut});
          break;
        default:
          fetchMessagesBaseOnGeo(geolocation, distance, numberOfMessage, this.setMessageRef);
          break;
      }
    }
  }

  render() {
    let elements = null;
//    let queryMessage = null;
//    let linebreak = <div><br/><br/><br/><br/></div>;
    let lon = 0; 
    let lat = 0;
    
    if(this.state.geolocation != null && this.state.geolocation != constant.invalidLocation) {
      lon = this.state.geolocation.longitude;
      lat = this.state.geolocation.latitude;
    }

    let sorting = this.props.filter.selectedSorting;
    if(sorting == 'sortByLastUpdate'){
      this.state.data.sort((i, j) => (j.lastUpdate==null?j.createdAt.toDate():j.lastUpdate.toDate()) - (i.lastUpdate==null?i.createdAt.toDate():i.lastUpdate.toDate()));
    }else if(sorting == 'sortByDistance'){
      this.state.data.sort((i, j) => (distance(i.geolocation.longitude,i.geolocation.latitude,lon,lat)) 
        - (distance(j.geolocation.longitude,j.geolocation.latitude,lon,lat)));
    }
    
    if(this.state.data.length == 0) {
      let statusMessage = this.state.statusMessage;
      return(<div><center><br/><h2>{statusMessage}</h2></center></div>);
    } else {
      elements = this.state.data.map((message) => {
        if(this.state.selectedTag != null && !message.tag.includes(this.state.selectedTag)) {
          // filter by selected tag.
          return null;
        } else {
          return (<MessageView message={message} key={message.key} lon={lon} lat={lat}/>);
        }
      });
      return (<div>{elements}</div>);
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
    updateFilter:
      (eventNumber, distance, geolocation) =>
        dispatch(updateFilter(eventNumber, distance, geolocation)),
    updateFilterTagList:
        (tagList) =>
          dispatch(updateFilterTagList(tagList)),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
