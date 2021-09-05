import { Reducer, useCallback, useEffect, useMemo, useReducer } from 'react';
import {
  RESET,
  SETCURRENTINDEX,
  END,
  TYPINGINSERT,
  TYPINGDELETE,
  ActionType,
  ActionItemType,
} from './Actions';
import {
  PhaseType,
  TypingActionType,
  TypingOptionsType,
  TypingStateType,
} from './types';

const reducer: Reducer<TypingStateType, ActionItemType> = (state, action) => {
  switch (action.type) {
    case ActionType.SETCURRENTINDEX:
      return SETCURRENTINDEX(state, action);
    case ActionType.RESET:
      return RESET(state);
    case ActionType.END:
      return END(state);
    case ActionType.TYPINGINSERT:
      return TYPINGINSERT(state, action);
    case ActionType.TYPINGDELETE:
      return TYPINGDELETE(state, action);
    case ActionType._ONTEXTCHANGE:
      return action.payload;
    default: {
      return state;
    }
  }
};

/**
 * React hook to create typing challenge/game/practice/test.
 * @param {string} text A string of words to be used for the typing sequence.
 * @param {Object} [options] Addition options to customize the functionality of the typing sequence.
 * @param {boolean} [options.skipCurrentWordOnSpace] Move on to the next word when space is inputted, defaults to `true`.
 * @param {boolean} [options.pauseOnError] Stay on the current index when the inputted character is wrong, defaults to `false`.
 * @param {countErrorTypes} [options.countErrors]
 * @returns Returns the state and the actions available for the typing hook.
 */
const useTypingGame = (
  text: string = '',
  options: Partial<TypingOptionsType> = {}
): { states: TypingStateType; actions: TypingActionType } => {
  const initialState = useMemo<TypingStateType>(
    () => ({
      startTime: null,
      endTime: null,
      chars: text,
      charsState: new Array(text.length).fill(0),
      length: text.length,
      currIndex: -1,
      currChar: '',
      correctChar: 0,
      errorChar: 0,
      phase: 0,
      skipCurrentWordOnSpace: true,
      pauseOnError: false,
      countErrors: 'everytime',
      ...options,
    }),
    [options, text]
  );

  const [states, dispatch] = useReducer<
    Reducer<TypingStateType, ActionItemType>
  >(reducer, initialState);

  useEffect(() => {
    dispatch({
      type: ActionType._ONTEXTCHANGE,
      payload: initialState,
    });
  }, [text, dispatch]);

  const getDuration = useCallback<TypingActionType['getDuration']>(() => {
    switch (states.phase) {
      case PhaseType.NotStarted: {
        return 0;
      }
      case PhaseType.Started: {
        return states.startTime ? new Date().getTime() - states.startTime : 0;
      }
      case PhaseType.Ended: {
        return states.startTime && states.endTime
          ? states.endTime - states.startTime
          : 0;
      }
    }
  }, [states.phase, states.startTime, states.startTime]);

  const resetTyping = useCallback<TypingActionType['resetTyping']>(
    () => dispatch({ type: ActionType.RESET }),
    [dispatch]
  );

  const endTyping = useCallback<TypingActionType['endTyping']>(
    () => dispatch({ type: ActionType.END }),
    [dispatch]
  );

  const insertTyping = useCallback<TypingActionType['insertTyping']>(
    (letter: string | undefined) => {
      const payload = letter ? letter[0] : null;
      dispatch({
        type: ActionType.TYPINGINSERT,
        payload,
      });
    },
    [dispatch]
  );

  const deleteTyping = useCallback<TypingActionType['deleteTyping']>(
    (deleteWord = false) => {
      dispatch({
        type: ActionType.TYPINGDELETE,
        payload: deleteWord || false,
      });
    },
    [dispatch]
  );

  const setCurrIndex = useCallback<TypingActionType['setCurrIndex']>(
    (num: number) => {
      if (num < -1 || num >= states.length || states.phase !== 2) {
        return false;
      }
      dispatch({
        type: ActionType.SETCURRENTINDEX,
        payload: num,
      });
      return true;
    },
    [dispatch, states.length, states.phase]
  );

  return {
    states,
    actions: {
      getDuration,
      resetTyping,
      endTyping,
      insertTyping,
      deleteTyping,
      setCurrIndex,
    },
  };
};

export default useTypingGame;
