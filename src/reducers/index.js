import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'
import undoable from './undoable'
import * as types from '../constants/ActionTypes'

const rootReducer = combineReducers({
  todos: undoable(todos, [types.ADD_TODO, types.DELETE_TODO, types.COMPLETE_TODO]),
  visibilityFilter
})

export default rootReducer
