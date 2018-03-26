import { combineReducers } from 'redux';  
import {
  FETCH_USER,
  FETCH_LOCATION,
  DISABLE_LOCATION,
  UPDATE_FILTER_LOCATION,
  UPDATE_FILTER,
  FETCH_ADDRESS_BOOK,
  FETCH_PUBLIC_ADDRESS_BOOK,
  TOGGLE_ADDRESS_DIALOG,
  TOGGLE_NEARBYEVENT_DIALOG,
  TOGGLE_REGIONEVENT_DIALOG,
  TOGGLE_LEADER_BOARD,
  FETCH_TOP_TWENTY,
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

function userReducer(state={user: null, loading: true}, action) {
  switch (action.type) {
    case FETCH_USER:
      return {user: action.user, loading: action.loading};
    default:
      return state;
  }
}

function addressBookReducer(state={addresses:[], publicAddress:[]}, action) {
  switch (action.type) {
    case FETCH_ADDRESS_BOOK:
      return {addresses: action.addresses}
    case FETCH_PUBLIC_ADDRESS_BOOK:
      return {publicAddresses: action.addresses}
    default:
      return state;
  }
}

function filterReducer(state={eventNumber: 20, geolocation: null, distance: 1}, action) {
  switch (action.type) {
    case UPDATE_FILTER:
      return {
        eventNumber: action.eventNumber,
        geolocation: action.geolocation,
        distance: action.distance
      };
    case UPDATE_FILTER_LOCATION:
      return {
        ...state,
        geolocation: action.geolocation,
      }
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

function nearbyEventDialogReducer(state={open: false}, action) {
  switch (action.type) {
    case TOGGLE_NEARBYEVENT_DIALOG:
      return {...state, open: action.open};
    default:
      return state;
  }
}

function regionEventDialogReducer(state={open: false}, action) {
  switch (action.type) {
    case TOGGLE_REGIONEVENT_DIALOG:
      return {...state, open: action.open};
    default:
      return state;
  }
}

function leaderBoardReducer(state={open: false, topTwenty:[]}, action) {
  console.log(action);
  switch (action.type) {
    case TOGGLE_LEADER_BOARD:
      return {...state, open: action.open};
    case FETCH_TOP_TWENTY:
      return {...state, topTwenty: action.users};
    default:
      return state;
  }
}

const rootReducer = combineReducers({  
  geoLocation: geoLocationReducer,
  user: userReducer,
  filter: filterReducer,
  addressBook: addressBookReducer,
  addressDialog: addressDialogReducer,
  nearbyEventDialog: nearbyEventDialogReducer,
  regionEventDialog: regionEventDialogReducer,
  leaderBoard: leaderBoardReducer,
});


export default rootReducer;
