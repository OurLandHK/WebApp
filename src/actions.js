import {
  UPDATE_FILTER,
  UPDATE_FILTER_DEFAULT,
  UPDATE_FILTER_LOCATION,
  UPDATE_FILTER_TAG_LIST,
  RESET_FILTER_TAGS,
  UPDATE_FILTER_TAG,
  UPDATE_RECENT_MESSAGE,
  UPDATE_RECENT_BOOKMARK,
  FETCH_USER,
  FETCH_USER_PROFILE,
//  DISABLE_LOCATION,
  FETCH_LOCATION,
  FETCH_ADDRESS_BOOK,
  FETCH_PUBLIC_ADDRESS_BOOK,
  FETCH_FOCUS_MESSAGE,
  UPDATE_PUBLIC_PROFILE_DIALOG,
  TOGGLE_PUBLIC_PROFILE_DIALOG,
  TOGGLE_ADDRESS_DIALOG,
  FETCH_GLOBAL_FOCUS_MESSAGE,
  TOGGLE_NEARBYEVENT_DIALOG,
  TOGGLE_REGIONEVENT_DIALOG,
  TOGGLE_EVENTLIST_DIALOG,
  TOGGLE_LEADER_BOARD,
  FETCH_TOP_TWENTY,
  UPDATE_REGIONEVENT_BUTTONLIST,
  FETCH_GLOBAL_TAG_STAT,
  UPDATE_FILTER_SORTING,
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
  UPDATE_SEARCHEVENT_LOCATION,
  TOGGLE_SEARCHEVENT_DIALOG,
} from './actions/types';
import * as firebase from 'firebase';
import config, {constant} from './config/default';
import {getUserProfile, updateUserProfile, fetchBookmarkList, getAddressBook} from './UserProfile';
import {fetchFocusMessagesBaseOnGeo, getTagStat} from './GlobalDB';

const currentLocationLabel = "現在位置";

function dispatchToggleNearbyEventDialog(flag) {
  return {type: TOGGLE_NEARBYEVENT_DIALOG, open: flag};
}

function dispatchToggleRegionEventDialog(flag) {
  return {type: TOGGLE_REGIONEVENT_DIALOG, open: flag};
}

function dispatchToggleSearchEventDialog(flag) {
  return {type: TOGGLE_SEARCHEVENT_DIALOG, open: flag};
}

function dispatchSearchEventLocation(geolocation) {
  return {type: UPDATE_SEARCHEVENT_LOCATION, geolocation: geolocation};
}

function dispatchToggleEventListDialog(flag) {
  return {type: TOGGLE_EVENTLIST_DIALOG, open: flag};
}

function dispatchToggleAddressBook(flag) {
  return {type: TOGGLE_ADDRESS_DIALOG, open: flag};
}

function dispatchToggleLeaderBoard(flag) {
  return {type: TOGGLE_LEADER_BOARD, open: flag};
}

function receiveLocation(pos, label=currentLocationLabel){
  return {type: FETCH_LOCATION, geoLocation: pos, label: label};
}
/*
function disableLocation() {
  return {type: DISABLE_LOCATION};
}
*/
function fetchAddressBook(address) {
  return {type: FETCH_ADDRESS_BOOK, addresses: address};
}

function fetchTagStat(tagStat) {
  return {type: FETCH_GLOBAL_TAG_STAT, tagStat: tagStat};
}

function fetchPublicAddressBook(address) {
  return {type: FETCH_PUBLIC_ADDRESS_BOOK, addresses: address};
}

function fetchFocusMessage(message) {
  return {type: FETCH_FOCUS_MESSAGE, messages: message};
}

function fetchGlobalFocusMessage(message) {
  return {type: FETCH_GLOBAL_FOCUS_MESSAGE, messages: message};
}

function fetchUser(user, loading=false) {
  return {type: FETCH_USER, user: user, loading: loading};
}

function fetchUserProfile(userProfile, lastLogin, bookmarkList) {
  return {type: FETCH_USER_PROFILE, userProfile: userProfile, lastLogin: lastLogin, bookmarkList: bookmarkList};
}

function dispatchRecentMessage(id, open) {
  return {type: UPDATE_RECENT_MESSAGE, id: id, open: open};
}

function dispatchRecentBookmark(uid, bookmark, open) {
  return {type: UPDATE_RECENT_BOOKMARK, uid: uid, bookmark: bookmark, open: open};
}

function dispatchPublicProfile(id, fbId, open) {
  return {type: UPDATE_PUBLIC_PROFILE_DIALOG, id: id, fbId: fbId, open: open};
}

function dispatchTogglePublicProfile(flag) {
  return {type: TOGGLE_PUBLIC_PROFILE_DIALOG, open: flag};
}


function dispatchFilterDefault(eventNumber, distance, geolocation) {
  return {type: UPDATE_FILTER_DEFAULT, eventNumber: eventNumber, geolocation: geolocation, distance: distance}
}

function dispatchFilter(eventNumber, distance, geolocation) {
  return {type: UPDATE_FILTER, eventNumber: eventNumber, geolocation: geolocation, distance: distance}
}

function dispatchFilterLocation(geolocation, distance) {
  return {type: UPDATE_FILTER_LOCATION, geolocation: geolocation, distance: distance};
}


function dispatchFilterTagList(tagList) {
  return {type: UPDATE_FILTER_TAG_LIST, tagList: tagList}
}

function dispatchRegionButtonList(buttonList){
  return {type: UPDATE_REGIONEVENT_BUTTONLIST, buttonList: buttonList}
}

function dispatchTagsRest() {
  return {type: RESET_FILTER_TAGS}
}

function dispatchSelectedTag(selectedTag) {
  return {type: UPDATE_FILTER_TAG, selectedTag: selectedTag}
}


function dispatchSelectedSorting(selectedSorting){
  return {type: UPDATE_FILTER_SORTING, selectedSorting: selectedSorting}
}

function dispatchOpenSnackbar(message, variant) {
  return {type: OPEN_SNACKBAR, open: true, message: message, variant: variant}
}

function dispatchCloseSnackbar() {
  return {type: CLOSE_SNACKBAR, open: false}
}

export function init3rdPartyLibraries() {
  const db = firebase.firestore();
  const settings = {/* your settings... */ timestampsInSnapshots: true};
  db.settings(settings);
}

export function fetchLocation(callback=receiveLocation) {
  return dispatch => {
    if(navigator.geolocation) {
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      navigator.geolocation.getCurrentPosition((geoLocation) => {
        console.log(geoLocation);
        callback(geoLocation);
      },
      (error) => {
        console.log(error);
        let coords = constant.timeoutLocation;
        if(error.code === 1) {
          coords = constant.invalidLocation;
        }
        let geoLocation = {coords: coords};
        callback(geoLocation)
      }, options);
    } else {
      alert('Location not supported!');
      let blockLocation = {coords: constant.invalidLocation};
      callback(blockLocation);
      //dispatch(disableLocation())
    }
  }
}

export function checkAuthState() {
  console.log("checkAuthState");
  return dispatch => {
    let  auth = firebase.auth();
    dispatch(fetchUser(null, true));
    return auth.onAuthStateChanged((user) => {
      dispatch(fetchUser(user));
      if(user!=null) {
        return getUserProfile(user).then((userProfile)=>{
          let lastLogin = Date.now();
          if(userProfile.lastLogin  != null ) {
            lastLogin = userProfile.lastLogin;
          }
          console.log("Last Login: " + lastLogin);
          return updateUserProfile(user, userProfile).then(()=>{
            console.log("Last Login: " + lastLogin);
            return fetchBookmarkList(user).then((bookmarkList)=>{
              return dispatch(fetchUserProfile(userProfile, lastLogin, bookmarkList));
            });
          });
        });
      }
      return null;
    });
  };
}

export function refreshUserProfile(user) {
  return dispatch => {
    getUserProfile(user).then((userProfile)=>{
      dispatch(fetchUserProfile(userProfile, null))});
  }
}

export function signIn() {
  return dispatch => {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_friends');
    provider.addScope('user_link');
    //provider.addScope('user_managed_groups');
    //provider.addScope('user_birthday');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // var token = result.credential.accessToken;
      // var user = result.user;
      console.log(result.additionalUserInfo.profile);
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
      console.log(`${errorCode} ${errorMessage} ${email} ${credential}`);
    });
  };
}

export function signOut() {
  return dispatch => {
    firebase.auth().signOut();
    dispatch(fetchUser(null));
  }
}

export function updateRecentMessage(id, open) {
  return dispatch => {
    dispatch(dispatchRecentMessage(id, open));
  };
}

export function updateRecentBookmark(uid, bookmark, open) {
  return dispatch => {
    dispatch(dispatchRecentBookmark(uid, bookmark, open));
  };
}

export function updatePublicProfileDialog(id, fbId, open) {
  return dispatch => {
    dispatch(dispatchPublicProfile(id, fbId, open));
  };
}

export function togglePublicProfileDialog(flag) {
  return dispatch => {
    dispatch(dispatchTogglePublicProfile(flag));
  };
}

export function updateFilter(eventNumber, distance, geolocation) {
  return dispatch => {
    dispatch(dispatchFilter(eventNumber, distance, geolocation));
  };
}

export function updateFilterDefault(eventNumber, distance, geolocation) {
  return dispatch => {
    dispatch(dispatchFilterDefault(eventNumber, distance, geolocation));
  };
}


export function updateFilterLocation(geolocation, distance) {
  return dispatch => {
    dispatch(dispatchFilterLocation(geolocation, distance));
  };
}

export function updateFilterTagList(tagList) {
  return dispatch => {
    dispatch(dispatchFilterTagList(tagList));
  };
}

export function resetTagList() {
  return dispatch => {
    dispatch(dispatchTagsRest());
  };
}

export function selectedTag(selectedTag) {
  return dispatch => {
    dispatch(dispatchSelectedTag(selectedTag));
  };
}

export function selectedSorting(selectedSorting) {
  return dispatch => {
    dispatch(dispatchSelectedSorting(selectedSorting));
  };
}

export function updateFilterWithCurrentLocation() {
  return dispatch => {
    dispatch(fetchLocation(geolocation => {
      dispatch(receiveLocation(geolocation));
      dispatch(updateFilterLocation(geolocation.coords));
    }));
  }
}

export function fetchAddressBookByUser(user) {
  return dispatch => {
    getAddressBook(user).then((addresses) => {
      dispatch(fetchAddressBook(addresses));
    });
    
  };
}

export function fetchAddressBookFromOurLand() {
  return dispatch => {
    let user = {uid: config.MasterUID};
    getAddressBook(user).then((addresses) => {
      dispatch(fetchPublicAddressBook(addresses));
    });
  };
}

export function fetchGlobalSetting() {
  return dispatch => {
    getTagStat().then((tagStat) => {
      let tagListObject = {};
      for (let key in tagStat) {
        tagListObject[key] = {tag: key, count: tagStat[key]};
      }
      let tagList = Object.values(tagListObject);
      tagList.sort((i, j) => (j.count) - (i.count));
      let tagLabel = tagList.map((tag) => {return(tag.tag)});
      dispatch(updateRegionButtoneList(tagLabel));
      dispatch(fetchTagStat(tagList));
    });
  };
}

export function fetchConcernMessagesFromOurLand() {
  return dispatch => {
    //var db = firebase.firestore();
    /// Use the UID for Ourland HK's account
    let user={uid:config.MasterUID}
    return getUserProfile(user).then((userProfile)=>{
      const messages = userProfile.concernMessages;
      dispatch(fetchFocusMessage(messages));
      return fetchFocusMessagesBaseOnGeo(null, 1).then((globalFocusMessage)=>{
        console.log(globalFocusMessage);
        return dispatch(fetchGlobalFocusMessage(globalFocusMessage));
      });
    });
  };
}

export function updateRegionButtoneList(tagList) {
  return dispatch => {let buttonList = [{label: constant.allButtonLabel, value: null}];
    let numberOfButton = 7;
    //console.log(`updateRegionButtoneList ${tagList}`);
    if(tagList.length < numberOfButton) {
      numberOfButton = tagList.length;
    }
    for(let i = 0; i < numberOfButton; i++) {
      //console.log(`button list ${tagList[i]}`);
      let button = {label: tagList[i], value: tagList[i]};
      buttonList.push(button);
    }
    dispatch(dispatchRegionButtonList(buttonList));
  }
}


export function upsertAddress(user, key, type, text, geolocation, streetAddress, interestedRadius) {
  return dispatch => {
    var geoPoint = null;
    if(geolocation  != null ) {
      geoPoint = new firebase.firestore.GeoPoint(geolocation.latitude, geolocation.longitude);
    }
    var now = Date.now();
    var addressRecord = {
        type: type,
        updateAt: new Date(now),
        text: text,
        geolocation: geoPoint,
        streetAddress: streetAddress,
        distance: interestedRadius
    };
    console.log(addressRecord);
    // Use firestore
    const db = firebase.firestore();


    var collectionRef = db.collection(config.userDB).doc(user.uid).collection(config.addressBook);

    if(key  != null ) {
       collectionRef.doc(key).get().then((addressBookRecord) => {
          collectionRef.doc(key).set(addressRecord).then(function() {
            dispatch(fetchAddressBookByUser(user))
          });
       });
    } else {
        collectionRef.add(addressRecord).then(function(docRef) {
          console.log("comment written with ID: ", docRef.id);
          dispatch(fetchAddressBookByUser(user))
        });
    }
  }
}

export function deleteAddress(user, key) {
  return dispatch => {
    const db = firebase.firestore();


    const collectionRef = db.collection(config.userDB).doc(user.uid).collection(config.addressBook);
    collectionRef.doc(key).delete().then(() => {
      dispatch(fetchAddressBookByUser(user))
    });
  };
}


export function toggleAddressDialog(flag) {
  return dispatch => {
    dispatch(dispatchToggleAddressBook(flag));
  };
}

export function toggleNearbyEventDialog(flag) {
  return dispatch => {
    dispatch(dispatchToggleNearbyEventDialog(flag));
  };
}

export function toggleRegionEventDialog(flag) {
  return dispatch => {
    dispatch(dispatchToggleRegionEventDialog(flag));
  };
}

export function toggleEventListDialog(flag) {
  return dispatch => {
    dispatch(dispatchToggleEventListDialog(flag));
  }
}

export function toggleLeaderBoard(flag) {
  return dispatch => {
    dispatch(dispatchToggleLeaderBoard(flag));
  }
}

export function fetchTopTwenty() {
  return dispatch => {
    console.log('fetchTopTwenty');
    const db = firebase.firestore();


    var collectionRef = db.collection(config.userDB).orderBy('publishMessagesCount', 'desc').limit(20);
    collectionRef.onSnapshot(function() {})
    collectionRef.get().then(function(querySnapshot){
       const users = querySnapshot.docs.map(d => ({... d.data(), id: d.id}));
       console.log(users);
       dispatch({type: FETCH_TOP_TWENTY, users: users}) ;
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

  }
}

export function openSnackbar(message, variant) {
  return dispatch => {
    dispatch(dispatchOpenSnackbar(message, variant))
  }
}

export function closeSnackbar() {
  return dispatch => {
    dispatch(dispatchCloseSnackbar())
  }
}

export function toggleSearchEventDialog(flag) {
  console.log(flag);
  return dispatch => {
    dispatch(dispatchToggleSearchEventDialog(flag));
  };
}

export function updateSearchEventLocation(geolocation) {
  return dispatch => {
    dispatch(dispatchSearchEventLocation(geolocation));
  };
}
