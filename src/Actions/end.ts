import type { TypingStateType } from '../types';

export default (state: TypingStateType): TypingStateType => ({
  ...state,
  phase: 2,
  endTime: new Date().getTime(),
});
