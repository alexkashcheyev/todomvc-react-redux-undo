import * as types from '../constants/ActionTypes'

export function undoable(reducer, ignoredActionTypes = []) {
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: []
  };

  return function(state = initialState, action) {
    switch(action.type) {
      case types.UNDO:

        if (!state.past.length) {
          return state
        } else {
          const newPresent = state.past[state.past.length - 1]
          const newPast = state.past.slice(0, -1)
          return {
            past: newPast,
            present: newPresent,
            future: [state.present, ...state.future]
          }
        }
      
      case types.REDO:

        if(!state.future.length) {
          return state
        } else {
          const newPresent = state.future[0]
          const newPast = [ ...state.past, state.present ]
          const newFuture = state.future.slice(1)
          return {
            present: newPresent,
            future: newFuture,
            past: newPast
          }
        }

      default:
        const newPresent = reducer(state, action)

        if (ignoredActionTypes.includes(action.type)) {
          return {
            ...state,
            present: reducer(state, action)
          }
        } else {
          return {
            past: [...state.past, state.present],
            present: newPresent,
            future: []
          }
        }

    }
  }

}