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
    var messageIds = [];
//    console.log("Message List" + this.props.messageIds);
    if(this.props.messageIds != null) {  
      messageIds = this.props.messageIds;
    }
    this.state = {
//      eventId: this.props.eventId,
      eventNumber: this.props.eventNumber,
      distance: this.props.distance, 
      geolocation: geolocation,
      userId: this.props.userId,
      data:[], 
      messageIds: messageIds,
      selectedTag: null,
      selectedSorting: null
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
    if (prevProps.user != this.props.user || 
      this.props.filter.geolocation != prevProps.filter.geolocation ||
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
    const { user } = this.props;
    if (user.user) {
      this.fetchMessages(user.user, filter); 
    } else {
      this.fetchMessages(null, filter); 
    }
  }

  setMessageRef(messageRef) {
    var val = messageRef.data();
    if(this.props.filter.geolocation != constant.invalidLocation && val != null) {
      var lon = this.props.filter.geolocation.longitude;
      var lat = this.props.filter.geolocation.latitude;
      var dis = distance(val.geolocation.longitude,val.geolocation.latitude,lon,lat);
      if(dis < this.props.filter.distance) {
        this.setMessage(val)  
      }
    } else {
      this.setMessage(val)
    }
  }

  setMessage(val) {
    if(val.tag != null && val.tag.length > 1) {      
      this.props.updateFilterTagList(val.tag);
    }
    this.state.data.push(val);
    this.setState({data:this.state.data});
  };

  clear() {
    this.setState({data: []});
  }  


  fetchMessages(user, filter) {
    if (user) {
      this.setState({user:user});     
    }
    const {
     eventNumber: numberOfMessage,
     distance,
     geolocation
    } = filter;
    this.setState({geolocation: geolocation});
    //console.log("Fetch MessageIDs: " + this.state.messageIds);
    if(this.state.messageIds.length != 0) {
      this.clear();
      this.state.messageIds.map((Ids) => {
        //console.log("Ids:" + Ids);
        getMessage(Ids).then((message) => {this.setMessage(message)});
      });
    } else if(geolocation != constant.invalidLocation) {
      this.clear();
      fetchMessagesBaseOnGeo(geolocation, distance, numberOfMessage, this.setMessageRef);
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
      this.state.data.sort((i, j) => (i.lastUpdate==null?i.createdAt:i.lastUpdate) < (j.lastUpdate==null?j.createdAt:j.lastUpdate));
    }else if(sorting == 'sortByDistance'){
      this.state.data.sort((i, j) => (distance(i.geolocation.longitude,i.geolocation.latitude,lon,lat)) 
        > (distance(j.geolocation.longitude,j.geolocation.latitude,lon,lat)));
    }
    
    elements = this.state.data.map((message) => {
      if(this.state.selectedTag != null && !message.tag.includes(this.state.selectedTag)) {
        // filter by selected tag.
        return null;
      } else {
        return (<MessageView message={message} key={message.key} user={this.state.user} lon={lon} lat={lat}/>);
      }
    });
    return (<div>{elements}</div>);
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    filter : state.filter,
    geolocation: state.geolocation,
    user: state.user,
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
