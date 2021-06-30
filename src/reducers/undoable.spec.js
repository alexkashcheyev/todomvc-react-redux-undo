import { undoable } from './undoable';
import { Chance } from 'chance';
import * as actions from '../actions'

const random = new Chance();

function setup(
  result = { value: random.natural() }
) {
  const randomState = () => ({ answer: random.natural() })

  const originalReducer = jest.fn().mockReturnValue(result);

  const stateWithoutHistory = {
    past: [],
    present: randomState(),
    future: [],
  }

  const stateWithFuture = {
    ...stateWithoutHistory,
    future: [randomState()]
  }

  const stateWithPast = {
    ...stateWithoutHistory,
    past: [randomState(), randomState()]
  }

  const stateWithHistory = {
    past: [randomState(), randomState()],
    present: randomState(),
    future: [randomState(), randomState()],
  }

  const unknownAction = {
    type: 'UNKNOWN'
  }

  const ignoredAction = {
    type: 'IGNORED'
  }

  const ignoredActionTypes = [ignoredAction.type];

  return {
    originalReducer,
    result,
    stateWithHistory,
    stateWithoutHistory,
    stateWithFuture,
    stateWithPast,
    unknownAction,
    ignoredAction,
    ignoredActionTypes
  }
}

describe('undoable higher order reducer', () => {

  describe('no action', () => {
    it('should generate initial state from original reducer', () => {
      const { originalReducer, result } = setup()

      expect(
        undoable(originalReducer)(undefined, {}).present
      ).toEqual(result)
    })

  })

  describe('on ignored action', () => {
    it('should call the original reducer', () => {
      const { originalReducer, ignoredActionTypes, stateWithHistory, ignoredAction } = setup()

      undoable(originalReducer, ignoredActionTypes)(stateWithHistory, ignoredAction)
      
      expect(originalReducer).toHaveBeenCalled()
    })

    it('should not change undo queue', () => {
      const { originalReducer, ignoredActionTypes, stateWithHistory, ignoredAction} = setup()

      expect(
        undoable(originalReducer, ignoredActionTypes)(stateWithHistory, ignoredAction).past
      ).toEqual(stateWithHistory.past)
    })

    it('should not change redo queue', () => {
      const { originalReducer, ignoredActionTypes, stateWithHistory, ignoredAction} = setup()

      expect(
        undoable(originalReducer, ignoredActionTypes)(stateWithHistory, ignoredAction).future
      ).toEqual(stateWithHistory.future)
    })
  })

  describe('on unknown action', () => {
    it('should clear the redo queue', () => {
      const { originalReducer, stateWithFuture, unknownAction } = setup()

      expect(undoable(originalReducer)(stateWithFuture, unknownAction).future).toEqual([])
    })

    it('should add current value to undo queue', () => {
      const { originalReducer, stateWithoutHistory, unknownAction } = setup()

      expect(
        undoable(originalReducer)(stateWithoutHistory, unknownAction).past
      ).toContainEqual(stateWithoutHistory.present)
    })

    it('should call the original reducer', () => {
      const { originalReducer, result, stateWithHistory, unknownAction } = setup()

      expect(
        undoable(originalReducer)(stateWithHistory, unknownAction).present
      ).toEqual(result)

      expect(originalReducer).toHaveBeenCalled()
    })
  })

  describe('on undo action', () => {
    it('should not change state if undo history is empty', () => {
      const { originalReducer, stateWithoutHistory } = setup()

      expect(
        undoable(originalReducer)(stateWithoutHistory, actions.undo())
      ).toEqual(stateWithoutHistory)
    })

    it('should replace current value with last added to past', () => {
      const { originalReducer, stateWithPast } = setup()

      expect(
        undoable(originalReducer)(stateWithPast, actions.undo()).present
      ).toEqual(stateWithPast.past[stateWithPast.past.length - 1])
    })

    it('should remove last value from the undo queue', () => {
      const { originalReducer, stateWithPast } = setup()

      expect(
        undoable(originalReducer)(stateWithPast, actions.undo()).past
      ).not.toContainEqual(stateWithPast.past[stateWithPast.past.length - 1])
    })

    it('should add current value to the redo queue', () => {
      const { originalReducer, stateWithPast } = setup()

      expect(
        undoable(originalReducer)(stateWithPast, actions.undo()).future
      ).toContainEqual(stateWithPast.present)
    })
  })

  describe('on redo action', () => {
    it('should not change state if redo queue is empty', () => {
      const { originalReducer, stateWithoutHistory } = setup()

      expect(
        undoable(originalReducer)(stateWithoutHistory, actions.redo())
      ).toEqual(stateWithoutHistory)
    })

    it('should replace current value with the first value from redo queue', () => {
      const { originalReducer, stateWithFuture } = setup()

      expect(
        undoable(originalReducer)(stateWithFuture, actions.redo()).present
      ).toEqual(stateWithFuture.future[0])
    })

    it('should remove redone value from redo queue', () => {
      const { originalReducer, stateWithFuture } = setup()

      expect(
        undoable(originalReducer)(stateWithFuture, actions.redo()).future
      ).not.toContainEqual(stateWithFuture.future[0])
    })

    it('should add current value to undo queue', () => {
      const { originalReducer, stateWithFuture } = setup()

      expect(
        undoable(originalReducer)(stateWithFuture, actions.redo()).past
      ).toContainEqual(stateWithFuture.present)
    })
  })
})