import { combineReducers } from 'redux';
import sessionReducer from './session';
import worksheetnameReducer from './worksheetname';
import filesReducer from './files';
import slidesReducer from './slides';
import dataNamesReducer from './datanames';
import currentReducer from './current';
import rightSidebarReducer from './rightsidebar';
import colorReducer from './color';
import jobsReducer from './jobs';
import isJobsActiveReducer from './isJobsActive';
import searchReducer from './search';
import notificationsReducer from './notifications';

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  worksheetnameState: worksheetnameReducer,
  filesState: filesReducer,
  slidesState: slidesReducer,
  dataNamesState: dataNamesReducer,
  currentState: currentReducer,
  rightSidebarState: rightSidebarReducer,
  colorState: colorReducer,
  jobsState: jobsReducer,
  isJobsActiveState: isJobsActiveReducer,
  searchState: searchReducer,
  notificationsState: notificationsReducer,
});

export default rootReducer;
