import { combineReducers } from 'redux';  
import {
  FETCH_USER,
  FETCH_LOCATION,
  DISABLE_LOCATION,
  UPDATE_FILTER_LOCATION,
  UPDATE_FILTER
} from './actions/types';


function geoLocationReducer(state={}, action) {
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

const rootReducer = combineReducers({  
  geoLocation: geoLocationReducer,
  user: userReducer,
  filter: filterReducer,
});


export default rootReducer;
