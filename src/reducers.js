import { combineReducers } from 'redux';  
import { FETCH_LOCATION, DISABLE_LOCATION } from './actions/types';


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

const rootReducer = combineReducers({  
  geoLocation: geoLocationReducer
});


export default rootReducer;
