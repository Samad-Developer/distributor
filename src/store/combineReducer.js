import { combineReducers } from 'redux';
import loginReducer from './reducers/login';
import menuSlice from './reducers/menuSlice';
import locationSlice from './reducers/locationSlice';
import UpdatedLocationSlice from './reducers/UpdatedLocationSlice';

const rootReducer = combineReducers({
  login: loginReducer,
  menu: menuSlice,
  location: locationSlice,
  updatedLocation: UpdatedLocationSlice
});

export default rootReducer;
