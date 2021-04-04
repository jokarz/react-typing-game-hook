export enum ActionType {
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

export { default as RESET } from './reset';
export { default as SETCURRENTINDEX } from './setCurrentIndex';
export { default as END } from './end';
export { default as TYPINGINSERT } from './typingInsert';
export { default as TYPINGDELETE } from './typingDelete';
