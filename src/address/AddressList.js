import React, { Component } from 'react';
import * as firebase from 'firebase';
import config from '../config/default';
import AddressView from './AddressView';
import {fetchAddressBaseonUser} from '../UserProfile';


class AddressList extends Component {
  constructor(props) {
    super(props);
    this.state = {data:[]};
    this.setAddress = this.setAddress.bind(this);
  }

  componentDidMount() {
    var auth = firebase.auth();
    auth.onAuthStateChanged((user) => {
        if (user) {
            this.fetchAddress(user); 
        } else {
            this.setState({data:[]})
        }
    });
  }

  setAddress(doc) {
    var val = doc;
    this.state.data.push(val);
    this.setState({data:this.state.data});
  };

  
  fetchAddress(user) {
    this.setState({user:user});
    fetchAddressBaseonUser(user, this.setAddress)
  }

  render() {
    let elements = null;
    elements = this.state.data.reverse().map((addressRef) => {
        return (<AddressView addressRef={addressRef}/>);
      });      
    return (<div width="100%">{elements}</div>);
  }
};

export default AddressList;
