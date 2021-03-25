import { TypingStateType } from '../index';

export default (state: TypingStateType): TypingStateType => ({
  ...state,
  phase: 2,
  endTime: new Date().getTime(),
});
