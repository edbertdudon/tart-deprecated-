import { combineReducers } from 'redux'
import sessionReducer from './session'
import worksheetnameReducer from './worksheetname'
import filesReducer from './files'
import slidesReducer from './slides'
import colorReducer from './color'
import jobsReducer from './jobs'
import isJobsActiveReducer from './isJobsActive'

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  worksheetnameState: worksheetnameReducer,
  filesState: filesReducer,
	slidesState: slidesReducer,
	colorState: colorReducer,
	jobsState: jobsReducer,
	isJobsActiveState: isJobsActiveReducer,
})

export default rootReducer
