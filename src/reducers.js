import { combineReducers } from 'redux';
import { constant } from './config/default';
import {
  FETCH_USER,
  FETCH_USER_PROFILE,
  FETCH_LOCATION,
  DISABLE_LOCATION,
  UPDATE_FILTER_LOCATION,
  UPDATE_FILTER,
  UPDATE_FILTER_DEFAULT,
  UPDATE_FILTER_TAG_LIST,
  RESET_FILTER_TAGS,
  UPDATE_FILTER_TAG,
  UPDATE_RECENT_MESSAGE,
  UPDATE_RECENT_BOOKMARK,
  FETCH_ADDRESS_BOOK,
  FETCH_PUBLIC_ADDRESS_BOOK,
  FETCH_GLOBAL_BOOKMARKLIST,
  FETCH_GLOBAL_FOCUS_MESSAGE,
  TOGGLE_ADDRESS_DIALOG,
  TOGGLE_NEARBYEVENT_DIALOG,
  TOGGLE_REGIONEVENT_DIALOG,
  TOGGLE_EVENTLIST_DIALOG,
  UPDATE_PUBLIC_PROFILE_DIALOG,
  TOGGLE_PUBLIC_PROFILE_DIALOG,
  TOGGLE_LEADER_BOARD,
  FETCH_TOP_TWENTY,
  UPDATE_FILTER_SORTING,
  UPDATE_REGIONEVENT_BUTTONLIST,
  FETCH_GLOBAL_TAG_STAT,
  OPEN_SNACKBAR,
  FETCH_FCM_TOKEN,
  CLOSE_SNACKBAR,
  UPDATE_SEARCHEVENT_LOCATION,
  TOGGLE_SEARCHEVENT_DIALOG,
} from './actions/types';


function geoLocationReducer(state={pos: null, enabled: true}, action) {
  switch (action.type) {
    case FETCH_LOCATION:
      return {...state, pos: action.geoLocation.coords, enabled: true };
    case DISABLE_LOCATION: 
      return {...state, pos: null, enabled: false};
    default:
      return state;
  }
}

function userReducer(state={user: null, fcmToken: null, userProfile: null, lastLogin: null, bookmarkList: [], loading: true}, action) {
  switch (action.type) {
    case FETCH_USER:
      return {...state, user: action.user, loading: action.loading};
    case FETCH_USER_PROFILE:
      if(action.lastLogin  != null ) {
        return {...state, userProfile: action.userProfile, lastLogin: action.lastLogin, bookmarkList: action.bookmarkList};
      } else {
        return {...state, userProfile: action.userProfile, bookmarkList: action.bookmarkList};
      }
    case FETCH_FCM_TOKEN:
      if(action.fcmToken !== null || action.fcmToken !== undefined) {
        return {...state, fcmToken: action.fcmToken};
      }
    default:
      return state;
  }
}

function addressBookReducer(state={addresses:[], publicAddresses:[]}, action) {
  switch (action.type) {
    case FETCH_ADDRESS_BOOK:
      return {...state,
            addresses: action.addresses}
    case FETCH_PUBLIC_ADDRESS_BOOK:
      return {...state,
              publicAddresses: action.addresses}
    default:
      return state;
  }
}

function filterReducer(state={defaultEventNumber: constant.defaultEventNumber, eventNumber: constant.defaultEventNumber, geolocation: null, distance: 1, defaultDistance: 1, selectedTag: {}, tagList: {}, selectedSorting: {}}, action) {
  let distance = action.distance;
  let selectedTag = state.selectedTag;
  let selectedSorting = state.selectedSorting;
  let tagList = state.tagList;
  switch (action.type) {
    case UPDATE_FILTER_DEFAULT:
      selectedTag = {};
      tagList = {}; 
      return {
        selectedTag: selectedTag,
        selectedSorting: {},
        tagList: tagList,
        defaultEventNumber: action.eventNumber,
        eventNumber: action.eventNumber,
        geolocation: action.geolocation,
        distance: action.distance,
        defaultDistance: action.distance,
      };
    case UPDATE_FILTER:
      if(state.defaultDistance > distance) {
        distance = state.defaultDistance;
      }
      var eventNumber = action.eventNumber;
      if(state.defaultEventNumber > eventNumber) {
        eventNumber = state.defaultEventNumber;
      }
      selectedTag[action.filterID] = null;
      tagList[action.filterID] = []; 
      return {
        ...state,
        selectedTag: selectedTag,
        tagList: tagList,
        eventNumber: eventNumber,
        geolocation: action.geolocation,
        distance: distance
      };
    case UPDATE_FILTER_LOCATION:
      if(state.defaultDistance > distance || distance === undefined) {
        distance = state.defaultDistance;
      }
      selectedTag[action.filterID] = null;
      tagList[action.filterID] = []; 
      return {
        ...state,
        selectedTag: selectedTag,
        tagList: tagList,
        geolocation: action.geolocation,
        distance: distance
      }
    case UPDATE_FILTER_TAG_LIST:
      //let filteredTagList = state.tagList[action.filterID];
      let newTagList = action.tagList;
      if(tagList[action.filterID] === undefined) {
        tagList[action.filterID] = [];
      }
      if(newTagList  != null ) {
        newTagList.map((tag) => {
          if(!tagList[action.filterID].includes(tag)) {
            tagList[action.filterID].push(tag);
          }
          return;
        });
      }
      selectedTag[action.filterID] = null;
      //tagList[action.filterID] = filteredTagList; 
      return {
        ...state,
        selectedTag: selectedTag,
        tagList: tagList,
      };
    case RESET_FILTER_TAGS:
      selectedTag[action.filterID] = null;
      tagList[action.filterID] = []; 
      return {
        ...state,
        selectedTag: selectedTag,
        tagList: tagList
      };
    case UPDATE_FILTER_TAG:
      selectedTag[action.filterID] = action.selectedTag;
      return {
        ...state,
        selectedTag: selectedTag
      };
    case UPDATE_FILTER_SORTING:
      selectedSorting[action.filterID] = action.selectedSorting;
      return {
        ...state,
        selectedSorting: selectedSorting
      };
    default:
      return state;
  }
}

function addressDialogReducer(state={open: false}, action) {
  switch (action.type) {
    case TOGGLE_ADDRESS_DIALOG:
      return {...state, open: action.open};
    default:
      return state;
  }
}

const buttonList = [
  { label: '所有', value: null },
  { label: '活動', value: '活動' },
  { label: '公共設施', value: '公共設施' },
  { label: '假日診所', value: '假日診所' },
  { label: '寵物', value: '寵物' },
  { label: '社區匯報', value: '社區匯報' },
  { label: '社區幹事', value: '社區幹事' },
  { label: '環保', value: '環保' },


].map(button => ({
  value: button.value,
  label: button.label,
}));

function nearbyEventDialogReducer(state={open: false, buttons: buttonList}, action) {
  switch (action.type) {
    case TOGGLE_NEARBYEVENT_DIALOG:
      return {...state, open: action.open};
    case UPDATE_REGIONEVENT_BUTTONLIST:
      return {...state, buttons: action.buttonList};
    default:
      return state;
  }
}

function regionEventDialogReducer(state={open: false, buttons: buttonList}, action) {
  switch (action.type) {
    case TOGGLE_REGIONEVENT_DIALOG:
      return {...state, open: action.open};
    case UPDATE_REGIONEVENT_BUTTONLIST:
      return {...state, buttons: action.buttonList};
    default:
      return state;
  }
}

function searchEventDialogReducer(state={open: false, geolocation: constant.invalidLocation, eventNumber: constant.defaultEventNumber, distance: 1}, action) {
  switch (action.type) {
    case TOGGLE_SEARCHEVENT_DIALOG:
      return {...state, open: action.open};
    case UPDATE_SEARCHEVENT_LOCATION:
      return {...state, geolocation: action.geolocation};
    default:
      return state;
  }
}

function leaderBoardReducer(state={open: false, topTwenty:[]}, action) {
  //console.log(action);
  switch (action.type) {
    case TOGGLE_LEADER_BOARD:
      return {...state, open: action.open};
    case FETCH_TOP_TWENTY:
      return {...state, topTwenty: action.users};
    default:
      return state;
  }
}

function recentMessageReducer(state={open: false, id: "", recentids: [], bookmark: {bookmark: ""}, recentbookmarks: []}, action) {
  let index = -1;
  switch (action.type) {
    case UPDATE_RECENT_MESSAGE:
      let recentids = state.recentids;
      index = recentids.indexOf(action.id);
      if(index === -1)
      {
          recentids.push(action.id);
      }
      return {...state, open: action.open, id: action.id, bookmark: {bookmark: ""}, recentids: recentids};
    case UPDATE_RECENT_BOOKMARK:
      let bookmark = {uid: action.uid,
                      bookmark: action.bookmark};
      console.log("UPDATE_RECENT_BOOKMARK Bookmark: " + bookmark);
      let recentbookmarks = state.recentbookmarks;
      index = recentbookmarks.indexOf(action.bookmark);
      if(index === -1)
      {
        recentbookmarks.push(action.bookmark);
      }
      return {...state, open: action.open, id: "", bookmark: bookmark, recentbookmarks: recentbookmarks};
    default:
      return state;
  }
}

function publicProfileDialogReducer(state={open: false, id: "", fbId: ""}, action) {
//  console.log(action);
  switch (action.type) {
    case UPDATE_PUBLIC_PROFILE_DIALOG:
      return {open: action.open, id: action.id, fbId: action.fbId};
    case TOGGLE_PUBLIC_PROFILE_DIALOG:
      if(action.open === false) {
        return {...state, id: "", open: action.open};
      } else {
        return {...state, open: action.open};
      }
    default:
      return state;
  }
}

function ourlandReducer(state={focusMessages: [], globalFocusMessage: [], tagStat: []}, action) {
    switch (action.type) {
      case FETCH_GLOBAL_BOOKMARKLIST:
        return {...state, bookmarkList: action.bookmarkList};
      case FETCH_GLOBAL_FOCUS_MESSAGE:
        return {...state, globalFocusMessages: action.messages};
      case FETCH_GLOBAL_TAG_STAT:
        return {...state, tagStat: action.tagStat};
      default:
        return state;
    }
  }

  const tagSuggestions = [
    { label: '公共地方維修' },
    { label: '活動' },
    { label: '環保'},
    { label: '公共設施' },
    { label: '義工招募' },
    { label: '兒童遊樂場' },
    { label: '郵箱' },
    { label: '寵物' },
    { label: '社區規劃' },
    { label: '社區匯報' },
    { label: '社區幹事' },


  ].map(suggestion => ({
    value: suggestion.label,
    label: suggestion.label,
  }));

function suggestionReducer(state={tag: tagSuggestions}, action) {
  switch (action.type) {
    default:
      return state;
  }
}

function eventListDialogReducer(state={open: false}, action) {
  switch (action.type) {
    case TOGGLE_EVENTLIST_DIALOG:
      return {...state, open: action.open};
    default:
      return state;
  }
}

function snackbarReducer(state={open: false, message: '', variant: 'success', }, action) {
  switch (action.type) {
    case OPEN_SNACKBAR:
      return {...state, open: action.open, message: action.message, variant: action.variant};
    case CLOSE_SNACKBAR:
      return {...state, open: action.open};
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  geoLocation: geoLocationReducer,
  user: userReducer,
  filter: filterReducer,
  addressBook: addressBookReducer,
  ourland: ourlandReducer,
  addressDialog: addressDialogReducer,
  nearbyEventDialog: nearbyEventDialogReducer,
  regionEventDialog: regionEventDialogReducer,
  searchEventDialog: searchEventDialogReducer,
  eventListDialog: eventListDialogReducer,
  leaderBoard: leaderBoardReducer,
  recentMessage: recentMessageReducer,
  publicProfileDialog: publicProfileDialogReducer,
  suggestions: suggestionReducer,
  snackbar: snackbarReducer
});


export default rootReducer;
