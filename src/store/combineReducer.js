import { combineReducers } from 'redux';
import loginReducer from './reducers/login';
import menuSlice from './reducers/menuSlice';
import locationSlice from './reducers/locationSlice';

const rootReducer = combineReducers({
  login: loginReducer,
  menu: menuSlice,
  location: locationSlice,
});

export default rootReducer;
