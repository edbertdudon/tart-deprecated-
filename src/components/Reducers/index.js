import { combineReducers } from 'redux'
import sessionReducer from './session'
import worksheetnameReducer from './worksheetname'
import filesReducer from './files'
import spreadsheetReducer from './spreadsheet'

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  worksheetnameState: worksheetnameReducer,
  filesState: filesReducer,
	spreadsheetState: spreadsheetReducer,
})

export default rootReducer
