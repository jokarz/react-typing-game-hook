import { Reducer, useReducer } from 'react';
import {
  RESET,
  SETCURRENTINDEX,
  END,
  TYPINGINSERT,
  TYPINGDELETE,
} from './Actions';

enum ActionType {
  RESET = 'RESET',
  END = 'END',
  TYPINGINSERT = 'TYPING/INSERT',
  TYPINGDELETE = 'TYPING/DELETE',
  SETCURRENTINDEX = 'SET/CURRENTINDEX',
}

export type ActionItemType =
  | { type: ActionType.RESET; payload?: undefined }
  | { type: ActionType.END; payload?: undefined }
  | { type: ActionType.TYPINGDELETE; payload: boolean }
  | { type: ActionType.TYPINGINSERT; payload: string | null }
  | { type: ActionType.SETCURRENTINDEX; payload: number };

/**
 * Represent the state of each character in the string.
 * `0` represents incomplete, `1` represents correct and, `2` represents incorrect.
 */
type CharStateType = 0 | 1 | 2;
type typingErrorTypes = 'everytime' | 'once';
interface TypingOptionsType {
  /**
   * Move on to the next word when space is inputted, defaults to `true`.
   */
  skipCurrentWordOnSpace: boolean;
  /**
   * Stay on the current index when the inputted character is wrong, defaults to `false`.
   */
  pauseOnError: boolean;
  /**
   * Choose to count errors everytime a mistake is made or only once for each mistake made, defaults to `everytime`.
   */
  countErrors: typingErrorTypes;
}

/**
 * Properties of the typing game hook.
 */
export interface TypingStateType extends TypingOptionsType {
  /**
   * The inputted string to be used.
   */
  chars: string;
  /**
   * Array of each character's state in the string.
   */
  charsState: CharStateType[];
  /**
   * Length of the string used.
   */
  length: number;
  /**
   * Current index of the character the user have typed till.
   */
  currIndex: number;
  /**
   * Current character the user have typed till.
   */
  currChar: string;
  /**
   * Number of correct character the user had typed.
   */
  correctChar: number;
  /**
   * Number of incorrect character the user had typed.
   */
  errorChar: number;
  /**
   * Represent the current state.
   * `0` typing haven't started, `1` typing started, `2` typing ended.
   */
  phase: 0 | 1 | 2;
  /**
   * Time in milliseconds when the typing started
   */
  startTime: number | null;
  /**
   * Time in milliseconds when the typing ended
   */
  endTime: number | null;
}

/**
 * Methods of the typing game hook.
 */
type TypingActionType = {
  /**
   * Duration in milliseconds since the typing started.
   * 0 if the typing has yet to start.
   * When the typing ended, the duration will be equivalent to endTime - startTime.
   */
  getDuration: () => number;
  /**
   * Reset the typing sequence.
   */
  resetTyping: () => void;
  /**
   * Ends the typing sequence but not reset it.
   */
  endTyping: () => void;
  /**
   * Insert a character into the current typing sequence.
   * @param {string | null} char A character to be inserted.
   * If falsy or no argument is supplied, skip the current character.
   */
  insertTyping: (char?: string | null) => void;
  /**
   * Delete a character from the current typing sequence.
   * @param {boolean} [deleteWord] If `true`, deletes the whole of the current word. Defaults to `false`.
   */
  deleteTyping: (deleteWord?: boolean) => void;
  /**
   * Set the current index manually.
   * @param {number} num Allows from -1 to length - 1 of the text, numbers that falls outside of the range will return a false.
   */
  setCurrIndex: (num: number) => boolean;
};

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
    default: {
      return state;
    }
  }
};

/**
 * React hook to create typing game/practice/test.
 * @param {string} text A string of words to be used for the typing sequence.
 * @param {Object} [options] Addition options to customize the functionality of the typing sequence.
 * @param {boolean} [options.skipCurrentWordOnSpace] Move on to the next word when space is inputted, defaults to `true`
 * @param {boolean} [options.pauseOnError] Stay on the current index when the inputted character is wrong, defaults to `false`
 * @param {typingErrorTypes} [options.countErrors]
 * @returns Returns the state and the actions available for the typing hook
 */
const useTypingGame = (
  text: string,
  options: Partial<TypingOptionsType> = {}
): { states: TypingStateType; actions: TypingActionType } => {
  const initialState: TypingStateType = {
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
  };

  const [states, dispatch] = useReducer<
    Reducer<TypingStateType, ActionItemType>
  >(reducer, initialState);

  return {
    states,
    actions: {
      getDuration: () => {
        switch (states.phase) {
          case 0: {
            return 0;
          }
          case 1: {
            return states.startTime
              ? new Date().getTime() - states.startTime
              : 0;
          }
          case 2: {
            return states.startTime && states.endTime
              ? states.endTime - states.startTime
              : 0;
          }
        }
      },
      resetTyping: () => dispatch({ type: ActionType.RESET }),
      endTyping: () => dispatch({ type: ActionType.END }),
      insertTyping: (letter = null) => {
        dispatch({
          type: ActionType.TYPINGINSERT,
          payload: letter ? letter[0] : null,
        });
      },
      deleteTyping: (deleteWord = false) => {
        dispatch({
          type: ActionType.TYPINGDELETE,
          payload: deleteWord || false,
        });
      },
      setCurrIndex: num => {
        if (num < -1 || num >= states.length || states.phase !== 2) {
          return false;
        }
        dispatch({
          type: ActionType.SETCURRENTINDEX,
          payload: num,
        });
        return true;
      },
    },
  };
};

export default useTypingGame;
