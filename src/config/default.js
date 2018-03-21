import './firebase';
import 'firebase/firestore';
import * as firebase from 'firebase';
import * as firestore from 'firebase/firestore';
//import 'firebase/firestore-types';

let config = {
  fbApp: {
  	appId: '640276812834634',
    cookie: true,
    xfbml: true,
    version: 'v2.10'
  },
/*  
  fbGroupId: '244493866025075', // Production https://www.facebook.com/groups/OurLandHK/?fref=nf
  messageDB: 'message', // Production
  userDB: 'userProfile', // Production
  photoDB: 'photo'
*/
  fbGroupId: '264191847414716', // For Development https://www.facebook.com/groups/264191847414716/ 
  messageDB: 'messageTest', // For development.
  userDB: 'userProfileTest', // For developments.
  photoDB: 'photoTest' // For developments.
};

let constant = {
  invalidLocation: new firebase.firestore.GeoPoint(90, 0),
  user: "用戶", 
  admin: "我地管理員",
  addressNotSet: "尚未設定",
  currentLocation: "現在位置",
  addressBookLabel: "地址簿",
  addAddressLabel: "新增地址",
  updateAddressLabel: "更新地址",
  nearbyEventLabel: "我的社區",
  regionEventLabel: "十八社區",
  recentEventLabel: "最近查看"
}

let regionAddressBook = [
  {
    label: "東區",
    lat: 22.2756648,
    long: 114.2059834,
    distance: 3
  },
  {
    label: "南區",
    lat: 22.2395616,
    long: 114.15374,
    distance: 10
  },
  {
    label: "灣仔區",
    lat: 22.2739793,
    long: 114.1647234,
    distance: 2
  },
  {
    label: "中西區",
    lat: 22.2724967,
    long: 114.1350874,
    distance: 3
  },   
   
];


let addressEnum = {
  home: "住宅",
  office: "辦工室",
  other: "其他"
}


export  default config;
export {constant, addressEnum};
