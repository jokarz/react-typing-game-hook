import { TypingStateType } from '../index';

export default (state: TypingStateType): TypingStateType => {
  let { chars } = state;

  return {
    ...state,
    startTime: null,
    endTime: null,
    charsState: new Array(chars.length).fill(0),
    currIndex: -1,
    currChar: '',
    correctChar: 0,
    errorChar: 0,
    keystrokes: 0,
    phase: 0,
  };
};
