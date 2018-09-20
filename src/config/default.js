import './firebase';
import 'firebase/firestore';
import * as firebase from 'firebase';

const isProduction = () => {
  const location = window.location;
  console.log(location.hostname);
  return location.hostname === "ourland.hk";
};

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
  TagStatisticKey: "TagStatistic",
  analyticsID: isProduction() ? "UA-124203709-1" : "UA-124203709-2",
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
  commentOptions : ['參與討論', '要求更新地點', '要求更新現況', '要求更新外部連結', '要求更新分類'],
  commentWithUrgentEventOptions : ['確定為緊急事項', '確定為非緊急事項'],
  commentWithOwnerOptions: ['更新事項縮圖'],
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
  focusSummaryLabel: '焦點簡介',
  radiusLabel: '半徑',
  descLabel: '內文',
  focusMessagesLabel: '焦點社區事件',
  updateFocusMessagesLabel: '更新焦點社區事件',
  addFocusMessagesLabel: '新增焦點社區事件',
  tagLabel: '分類',
  tagPlaceholder: '新增分類',
  interestedTagPlaceholder: '新增喜愛分類',
  notificationLabel: '通知',
  weekdayLabel : ['日', '一', '二', '三', '四', '五', '六'],
  openningOptions : ['每日', '自訂'],
  intervalOptions : ['不重複', '每星期', '每兩星期','每月'],
  durationOptions : ['0:30', '1:00', '1:30','2:00','3:00','4:00','6:00','8:00','10:00','12:00','18:00','一天','兩天','三天','四天','五天','六天','一週'],
  distance: 1,
  kilometre: '公里',
  nearby: "附近",
  emptyComment: '按+參與討論或更新內容',
  interestedRadius: '有效半徑',
  updateThumbnailMessage: '用戶更新社區事件縮圖',
  pleaseInputLocation: '請輸入地點',
  pleaseInputSummary: '請輸入簡介',
  pleaseInputLink: '請輸入外部連結',
  pleaseInputRadius: '請輸入半徑',
  pleaseInputDesc: '請輸入內文',
  pleaseInputTitle: '請輸入事件名稱',
  pleaseSelectImage: '請選擇縮圖',
  createMessageSuccess: "新增社區事件成功",
  createMessageFailure: "新增社區事件失敗",
  EmailAddressWarning: "請輸入正確電郵地址",
  updateProfileSuccess: "更新用戶簡介成功",
  updateProfileFailure: "更新用戶簡介失敗",
  updateProfileAddressSuccess: "更新用戶地址成功",
  deleteProfileAddressSuccess: "刪除用戶地址成功",
  addCommentSuccess: "參與討論成功",
  addCommentFailure: "參與討論失敗",
  addCompleteMessageSuccess: "新增完成事件成功",
  addCompleteMessageFailure: "新增完成事件失敗",
  addMessageGallerySuccess: "新增圖片庫成功",
  addMessageGalleryFailure: "新增圖片庫失敗",
  updateMessageThumbnailSuccess: "更新用戶縮圖成功",
  updateMessageThumbnailFailure: "更新用戶縮圖失敗",
  updateCommentApproveStatusSuccess: "駁回成功",
  updateCommentApproveStatusFailure: "駁回失敗",
  addFocusMessageSuccess: "新增焦點社區事件成功",
  addFocusMessageFailure: "新增焦點社區事件失敗",
  updateFocusMessageSuccess: "更新焦點社區事件成功",
  updateFocusMessageFailure: "更新焦點社區事件失敗",
  dropFocusMessageSuccess: "刪除焦點社區事件成功",
  dropFocusMessageFailure: "刪除焦點社區事件失敗",
  FocusViewTitleWarning: ""
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
