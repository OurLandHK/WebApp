import { combineReducers } from 'redux';  
import { FETCH_USER, FETCH_LOCATION, DISABLE_LOCATION } from './actions/types';


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

const rootReducer = combineReducers({  
  geoLocation: geoLocationReducer,
  user: userReducer
});


export default rootReducer;
