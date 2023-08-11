import { combineReducers } from 'redux'
import { app } from './app'
import { auth } from '../../core/onboarding/redux/auth'
import { chat } from '../../core/chat/redux'
import { userReports } from '../../core/user-reporting/redux'
import { favorites } from '../../core/favorites/redux'

const LOG_OUT = 'LOG_OUT'

// combine reducers to build the state
const appReducer = combineReducers({
  auth,
  app,
  chat,
  userReports,
  favorites,
})

const rootReducer = (state, action) => {
  if (action.type === LOG_OUT) {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer
