[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/jokarz/react-typing-game-hook/run-test.yml?branch=main)](#)

[![npm](https://img.shields.io/npm/v/react-typing-game-hook?label=npm%20package&logo=npm)](https://www.npmjs.com/package/react-typing-game-hook) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-typing-game-hook)](#)

# React Typing Game Hook

Easily create typing games functionalty (10fastestfinger, monkeytype, keybr, etc) with this react hook that handles the typing logic

# About

This hook takes care of the states and the little details that goes on when users type in a typing game/test/challenge! Your part is to just capture the inputs from the user!

# Demos

[Basic Demo](https://codesandbox.io/s/admiring-bash-hjjtd)

[Simple typing via input box Demo](https://codesandbox.io/s/sad-parm-gtm15)

[Simple typing on text Demo](https://codesandbox.io/s/epic-merkle-23s75)

<!-- # Demo here -->

# Getting Started

## Importing

```
npm install react-typing-game-hook
```

or

```
yarn add react-typing-game-hook
```

## Usage

Here's a simple example of it (live [here](https://codesandbox.io/s/wispy-frost-6pfc6))

```jsx
import React from 'react';
// import it
import useTypingGame, { CharStateType } from 'react-typing-game-hook';

const TypingGameComponent = () => {
  // Call the hook
  const {
    states: { chars, charsState },
    actions: { insertTyping, resetTyping, deleteTyping },
  } = useTypingGame('Click on me and start typing away!');

  // Capture and display!
  return (
    <h1
      onKeyDown={e => {
        e.preventDefault();
        const key = e.key;
        if (key === 'Escape') {
          resetTyping();
          return;
        }
        if (key === 'Backspace') {
          deleteTyping(false);
          return;
        }
        if (key.length === 1) {
          insertTyping(key);
        }
      }}
      tabIndex={0}
    >
      {chars.split('').map((char, index) => {
        let state = charsState[index];
        let color =
          state === CharStateType.Incomplete
            ? 'black'
            : state === CharStateType.Correct
            ? 'green'
            : 'red';
        return (
          <span key={char + index} style={{ color }}>
            {char}
          </span>
        );
      })}
    </h1>
  );
};
export default TypingGameComponent;
```

Have a look at the demos above as well as the hooks details below to find out more!

# Hook Details

## Structure Breakdown

```jsx
const {
  states: {
    startTime,
    endTime,
    chars,
    charsState,
    length,
    currIndex,
    currChar,
    correctChar,
    errorChar,
    phase,
  },
  actions: {
    resetTyping,
    endTyping,
    insertTyping,
    deleteTyping,
    setCurrIndex,
    getDuration,
  },
} = useTypingGame(text, {
  skipCurrentWordOnSpace: true,
  pauseOnError: false,
  countErrors: 'everytime',
});
```

## Enumeration Breakdown

```ts
import { PhaseType, CharStateType } from 'react-typing-game-hook';

PhaseType {
  NotStarted = 0,
  Started = 1,
  Ended = 2,
}

CharStateType {
  Incomplete = 0,
  Correct = 1,
  Incorrect = 2,
}
```

## Hook Parameters

| Name                       | Functionalty                                                                                                                                                                         | Default value |
| :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----------: |
| **skipCurrentWordOnSpace** | When `true`, moves on to the _next word_ when space is inputted. Otherwise, it moves on to the _next character_ instead                                                              |    `true`     |
| **pauseOnError**           | When `true`, stays on the _same character_ until it is correctly inputted. Otherwise, it moves on to the _next character_ instead                                                    |    `false`    |
| **countErrors**            | When value is `'everytime'`, count errors anytime a mistake is made. When value is `'once'`, count errors only once for each mistake made at the position where the letter is typed. | `'everytime'` |

## Hook States

| Name            | Functionalty                                                                                                                                                                                                                                                                                                                                                                                                   |     Data Type     |                         Initial value                          |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------: | :------------------------------------------------------------: |
| **startTime**   | Time in milliseconds (since the Unix Epoch) when the typing started.                                                                                                                                                                                                                                                                                                                                           |     `number`      |         Prior to when the typing starts, it is `null`          |
| **endTime**     | Time in milliseconds(since the Unix Epoch) when the typing test ended.                                                                                                                                                                                                                                                                                                                                         |     `number`      |          Prior to when the typing ended, it is `null`          |
| **chars**       | The inputted text to be used for typing.                                                                                                                                                                                                                                                                                                                                                                       |     `string`      |                               -                                |
| **length**      | The lengh of the inputted text                                                                                                                                                                                                                                                                                                                                                                                 |     `number`      |              Length of the inputted text `chars`               |
| **charsState**  | Array of each character's state of the inputted text. Each item represents the corresponding chararacter of the text inputted. <br>`CharStateType.Incomplete` - has yet to be determined to be correct or incorrect <br>`CharStateType.Correct` - is determined to be correct <br>`CharStateType.Incorrect` - is determined to be incorrect.<br><br>Use of `CharStateType` over numeric literal is recommended | `CharStateType[]` | Array length of `chars` filled with `CharStateType.Incomplete` |
| **currIndex**   | Current character index of the text the user have typed till.                                                                                                                                                                                                                                                                                                                                                  |     `number`      |                               -1                               |
| **currChar**    | Current character the user have typed till.                                                                                                                                                                                                                                                                                                                                                                    |     `string`      |                               ''                               |
| **correctChar** | Number of correct character the user had typed.                                                                                                                                                                                                                                                                                                                                                                |     `number`      |                               0                                |
| **errorChar**   | Number of incorrect character the user had typed.                                                                                                                                                                                                                                                                                                                                                              |     `number`      |                               0                                |
| **phase**       | Represent the current state of the typing test. <br>`PhaseType.NotStarted` - typing haven't started <br>`PhaseType.Started` - typing started <br>`PhaseType.Ended` - typing ended <br><br>Use of `PhaseType` over numeric literal is recommended                                                                                                                                                               |    `PhaseType`    |                     `PhaseType.NotStarted`                     |

## Hook Methods

| Name             | Functionalty                                                                                                                                                                                                                               |              Signature               |               Return value               |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------: | :--------------------------------------: |
| **insertTyping** | Insert a character into the current typing sequence. It will start the typing if it hasn't been started as well as end the typing for you when the last character has been entered.                                                        |     `insertTyping(char:string)`      |                    -                     |
| **deleteTyping** | It only works when the typing has been started. Allows for the current word in the typing sequence to be deleted when passed with a parameter of `true`, otherwise it deletes only a character from the current typing (default behavior). | `deleteTyping(deleteWord?: boolean)` |                    -                     |
| **resetTyping**  | Reset to its initial state.                                                                                                                                                                                                                |           `resetTyping()`            |                    -                     |
| **endTyping**    | Ends the current typing sequence if it had started. States persist when ended and `endTime` is captured.                                                                                                                                   |            `endTyping()`             |                    -                     |
| **setCurrIndex** | Set the current index manually. Only works when `phase` is `PhaseType.NotStarted` (haven't started typing) or `PhaseType.Started` (during typing).                                                                                         |     `setCurrIndex(index:number)`     | `true` if successfull, otherwise `false` |
| **getDuration**  | Duration in milliseconds since the typing started.                                                                                                                                                                                         |           `getDuration()`            |   `0` if the typing has yet to start.    |
