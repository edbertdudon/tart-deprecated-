import { combineReducers } from 'redux';
import sessionReducer from './session';
import worksheetnameReducer from './worksheetname';
import worksheetsReducer from './worksheets';
import slidesReducer from './slides';
import dataNamesReducer from './datanames';
import currentReducer from './current';
import savingReducer from './saving';
import rightSidebarReducer from './rightsidebar';
import chartSelectReducer from './chartselect';
import colorReducer from './color';
import jobsReducer from './jobs';
import isJobsActiveReducer from './isJobsActive';
import searchReducer from './search';
import notificationsReducer from './notifications';

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  colorState: colorReducer,
  worksheetnameState: worksheetnameReducer,
  worksheetsState: worksheetsReducer,
  slidesState: slidesReducer,
  dataNamesState: dataNamesReducer,
  currentState: currentReducer,
  savingState: savingReducer,
  rightSidebarState: rightSidebarReducer,
  chartSelectState: chartSelectReducer,
  jobsState: jobsReducer,
  isJobsActiveState: isJobsActiveReducer,
  searchState: searchReducer,
  notificationsState: notificationsReducer,
});

export default rootReducer;
