import { combineReducers } from 'redux';  
import {
  FETCH_USER,
  FETCH_LOCATION,
  DISABLE_LOCATION,
  UPDATE_FILTER_LOCATION,
  UPDATE_FILTER,
  FETCH_ADDRESS_BOOK,
  TOGGLE_ADDRESS_DIALOG,
  TOGGLE_NEARBYEVENT_DIALOG,
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

function addressBookReducer(state={addresses:[]}, action) {
  switch (action.type) {
    case FETCH_ADDRESS_BOOK:
      return {addresses: action.addresses}
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

const rootReducer = combineReducers({  
  geoLocation: geoLocationReducer,
  user: userReducer,
  filter: filterReducer,
  addressBook: addressBookReducer,
  addressDialog: addressDialogReducer,
  nearbyEventDialog: nearbyEventDialogReducer,
});


export default rootReducer;
