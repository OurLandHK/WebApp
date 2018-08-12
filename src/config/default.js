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
  userAction: 'userAction',

  fbGroupId: '244493866025075', // Production https://www.facebook.com/groups/OurLandHK/?fref=nf
  globalDB: 'ourlandDB', // for all globalDB setting
  messageDB: 'message', // Production
  userDB: 'userProfile', // Production
  focusMessageDB: 'focusMessage',
  photoDB: 'photo',
  MasterUID: 'mUQgwxkmPBfVA47d9lHzB482Nmp1',
  addressBook: "AddressBook",
  commentDB: "comment",
  bookDB: "Bookmark",
  TagStatisticKey: "TagStatistic"
};

let constant = {
  allButtonLabel: '所有',
  invalidLocation: new firebase.firestore.GeoPoint(90, 0),
  timeoutLocation: new firebase.firestore.GeoPoint(90, 180),
  closeWholeDay:"全日關門",
  addressNotSet: "尚未設定",
  currentLocation: "附近",
  addressBookLabel: "地址簿",
  addAddressLabel: "新增地址",
  updateAddressLabel: "更新地址",
  addBookmarkLabel: "新增關注分類",
  bookmarkTitleLabel: "關注分類",
  updateBookmarkLabel: "更新關注分類",
  nearbyEventLabel: "我的社區",
  regionEventLabel: "十八社區",
  recentEventLabel: "最近查看",
  leaderBoardLabel: "排名榜",
  noTagLabel: "所有事件",
  viewCountLabel: '觀看次數：',
  publicProfileLabel: "簡介",
  sortByLastUpdateLabel: "最近更新排序",
  sortByDistanceLabel: "距離排序",
  defaultEventNumber: 100,
  concernLabel: "關注",
  myBookmarkLabel: "我的關注",
  publicBookmarkLabel: "我地關注",
  homeLabel: "主頁",
  userLabel: "我的",
  timeOptions : ['活動時間', '設施開放時間'],
  commentOptions : ['發表回應', '要求更改地點', '要求更改現況', '要求更改外部連結', '要求更改分類'],
  commentWithUrgentEventOptions : ['確定為緊急事項', '確定為非緊急事項'],
  statusOptions : ['開放', '完結', '政府跟進中', '虛假訊息', '不恰當訊息'],
  approveOptions : ['接納', '駁回'],
  messageDialogLabel: '社區事件',
  messageListReadingLocation: '讀取所在位置中...',
  messageListLoadingStatus: '讀取社區事件中...',
  messageListNoMessage: '已選位置沒有任何社區事件，請選擇其他位置',
  messageListBlockLocation: '請允許Ourland.hk讀取所在位置，或選擇其他位置',
  messageListTimeOut: '未能讀取現在位置，請選擇其他位置或重試',
  rankingListLoadingStatus: '讀取排行榜中...',
  rankingListNoMessage: '已選位置未有任何人報料，不如你做第一個',
  urgent: "緊急",
  reportedUrgent: "用戶報告為緊急事件",
  focusTitleLabel: '焦點名稱',
  radiusLabel: '半徑',
  descLabel: '內文',
  focusMessagesLabel: '焦點社區事件',
  updateFocusMessagesLabel: '更新焦點社區事件',
  addFocusMessagesLabel: '新增焦點社區事件',
  tagLabel: '分類',
  tagPlaceholder: '新增分類',
  notificationLabel: '通知',
  weekdayLabel : ['日', '一', '二', '三', '四', '五', '六'],
  openningOptions : ['每日', '自訂'],
  intervalOptions : ['不重複', '每星期', '每兩星期','每月'],
  durationOptions : ['0:30', '1:00', '1:30','2:00','3:00','4:00','6:00','8:00','10:00','12:00','18:00','一天','兩天','三天','四天','五天','六天','一週'],
  distance: 1,
}

const happyAndSadEnum = {
  happy: 1,
  sad: -1,
  nothing: 0
}

const addressEnum = {
  home: "住宅",
  office: "辦工室",
  other: "其他"
}

const RoleEnum = {
  user: "用戶",
  betaUser: "測試用戶",
  advancedUser: "進階用戶",
  monitor: "監察員",
  admin: "我地管理員", 
}

export  default config;
export {constant, addressEnum, happyAndSadEnum, RoleEnum};
