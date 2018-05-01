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
  photoDB: 'photo',
/*/
  fbGroupId: '264191847414716', // For Development https://www.facebook.com/groups/264191847414716/ 
  messageDB: 'messageTest', // For development.
  userDB: 'userProfileTest', // For developments.
  photoDB: 'photoTest', // For developments.


  addressBook: "AddressBook",
  commentDB: "comment"
};

let constant = {
  invalidLocation: new firebase.firestore.GeoPoint(90, 0),
  timeoutLocation: new firebase.firestore.GeoPoint(90, 180),
  user: "用戶", 
  admin: "我地管理員",
  addressNotSet: "尚未設定",
  currentLocation: "現在位置",
  addressBookLabel: "地址簿",
  addAddressLabel: "新增地址",
  updateAddressLabel: "更新地址",
  nearbyEventLabel: "我的社區",
  regionEventLabel: "十八社區",
  recentEventLabel: "最近查看",
  leaderBoardLabel: "人氣排名榜",
  noTagLabel: "所有事件",
  viewCountLabel: '觀看次數: ',
  publicProfileLabel: "簡介",
  sortByDefaultLabel: "沒有排序",
  sortByLastUpdateLabel: "最近更新排序",
  sortByDistanceLabel: "距離排序",
  defaultEventNumber: 100,
  commentOptions : ['發表回應', '要求更改地點', '要求更改現況', '要求更改外部連結', '要求更改分類'],    
  statusOptions : ['開放', '完結', '政府跟進中', '虛假訊息', '不恰當訊息'],
  approveOptions : ['接納', '駁回'],
  messageListReadingLocation: '讀取現在位置中...',
  messageListLoadingStatus: '讀取社區事件中...',
  messageListNoMessage: '選擇的位置沒有任何社區事件, 請選擇其他位置',
  messageListBlockLocation: '請解除對Ourland.hk讀取現在位置的封鎖, 或選擇其他位置',
  messageListTimeOut: '未能讀取現在位置, 請選擇其他位置或再試讀取',
  
}


let addressEnum = {
  home: "住宅",
  office: "辦工室",
  other: "其他"
}


export  default config;
export {constant, addressEnum};
