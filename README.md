# React Typing Game Hook

Easily create typing games functionalty (10fastestfinger, monkeytype, keybr, etc) with this react hook that handles the typing logic

# About

This hook manages the states that goes on when users type in a typing game (correct characters, error characters, where the user typed till, etc) and all you need to do is to capture the inputs from the user!

# Demos

[Simple Demo](https://codesandbox.io/s/wonderful-rgb-wdvxt)

[Typing on Input Demo](https://codesandbox.io/s/pensive-star-58xy6)

[Typing on the text Demo](https://codesandbox.io/s/elastic-swirles-20914)

<!-- # Demo here -->

# Getting Started

## Adding the hook

```
npm add react-typing-game-hook
```

## Using it

Here's a simple example of it (live [here](https://codesandbox.io/s/romantic-andras-uguy2))

```jsx
import React from 'react';
// import it
import useTypingGame from 'react-typing-game-hook';

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
        const key = e.key;
        if (key === 'Escape') {
          resetTyping();
        } else if (key === 'Backspace') {
          deleteTyping(false);
        } else if (key.length === 1) {
          insertTyping(key);
        }
        e.preventDefault();
      }}
      tabIndex={0}
    >
      {chars.split('').map((char, index) => {
        let state = charsState[index];
        let color = state === 0 ? 'black' : state === 1 ? 'green' : 'red';
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

Have a look at the demos on codesandbox above as well as the hooks details below to find out more!

<!-- ```jsx
import React from 'react';
import useTypingTest from 'react-typing-test-hook';

const TypingTest = () => {
  let text = 'The quick brown fox jumps over the lazy dog';
  const {
    states: { wordsState, currIndex },
    action: { insertTyping, resetTyping, deleteTyping },
  } = useTypingTest(text);

  const handleKey = key => {
    if (key === 'Escape') {
      resetTyping();
    } else if (key === 'Backspace') {
      deleteTyping();
    } else {
      insertTyping(key[0]);
    }
  };

  return (
    <>
      <div
        className="typing-test"
        onKeyDown={e => handleKey(e.key)}
        tabIndex={0}
      >
        {text.split('').map((char: string, index: number) => {
          let state = wordsState[index];
          let color = state === 0 ? 'black' : state === 1 ? 'green' : 'red';
          return (
            <span
              key={char + index}
              style={{ color }}
              className={currIndex + 1 === index ? 'curr-letter' : ''}
            >
              {char}
            </span>
          );
        })}
      </div>
    </>
  );
};
``` -->

# Hook Details

## Structure

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
  actions: { resetTyping, endTyping, insertTyping, deleteTyping, setCurrIndex },
} = useTypingGame(text, {
  skipCurrentWordOnSpace: true,
  pauseOnError: false,
});
```

## Parameters

| Name                       | Functionalty                                                                                                                      | Default value |
| :------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :-----------: |
| **skipCurrentWordOnSpace** | When `true`, moves on to the _next word_ when space is inputted. Otherwise, it moves on to the _next character_ instead           |    `true`     |
| **pauseOnError**           | When `true`, stays on the _same character_ until it is correctly inputted. Otherwise, it moves on to the _next character_ instead |    `false`    |

## States

| Name            | Functionalty                                                                                                                                                                                                                                                                                                                                                                  | Data Type  |                 Initial value                 |
| :-------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------: | :-------------------------------------------: |
| **startTime**   | Time in milliseconds (since the Unix Epoch) when the typing started.                                                                                                                                                                                                                                                                                                          |  `number`  | Prior to when the typing starts, it is `null` |
| **endTime**     | Time in milliseconds(since the Unix Epoch) when the typing test ended.                                                                                                                                                                                                                                                                                                        |  `number`  | Prior to when the typing ended, it is `null`  |
| **chars**       | The inputted text to be used for typing.                                                                                                                                                                                                                                                                                                                                      |  `string`  |                       -                       |
| **length**      | The lengh of the inputted text                                                                                                                                                                                                                                                                                                                                                |  `number`  |      Length of the inputted text `chars`      |
| **charsState**  | Array of each character's state of the inputted text. Each item represents the corresponding chararacter of the text inputted. <br>`0` - represents incomplete where the user had yet to reach/enter this character <br>`1` - represents correct where the user had entered the right character <br>`2` - represents incorrect where the user had entered the wrong character | `number[]` |     Array length of `chars` filled with 0     |
| **currIndex**   | Current character index of the text the user have typed till.                                                                                                                                                                                                                                                                                                                 |  `number`  |                      -1                       |
| **currChar**    | Current character the user have typed till.                                                                                                                                                                                                                                                                                                                                   |  `string`  |                      ''                       |
| **correctChar** | Number of correct character the user had typed.                                                                                                                                                                                                                                                                                                                               |  `number`  |                       0                       |
| **errorChar**   | Number of incorrect character the user had typed.                                                                                                                                                                                                                                                                                                                             |  `number`  |                       0                       |
| **phase**       | Represent the current state of the typing test. <br>`0` - typing haven't started<br>`1` - typing started<br>`2` - typing ended                                                                                                                                                                                                                                                |  `number`  |                       0                       |

## Methods

| Name             | Functionalty                                                                                                                                                                                                                               |              Signature               |               Return value               |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------: | :--------------------------------------: |
| **insertTyping** | Insert a character into the current typing sequence. It will start the typing if it hasn't been started as well as end the typing for you when the last character has been entered.                                                        |     `insertTyping(char:string)`      |                    -                     |
| **deleteTyping** | It only works when the typing has been started. Allows for the current word in the typing sequence to be deleted when passed with a parameter of `true`, otherwise it deletes only a character from the current typing (default behavior). | `deleteTyping(deleteWord?: boolean)` |                    -                     |
| **resetTyping**  | Reset to its initial state.                                                                                                                                                                                                                |           `resetTyping()`            |                    -                     |
| **endTyping**    | Ends the current typing sequence if it had started. States persist when ended and `endTime` is captured.                                                                                                                                   |            `endTyping()`             |                    -                     |
| **setCurrIndex** | Set the current index manually. Only works when `phase` is `0` (haven't started typing) or `1` (during typing).                                                                                                                            |     `setCurrIndex(index:number)`     | `true` if successfull, otherwise `false` |
| **getDuration**  | Duration in milliseconds since the typing started.                                                                                                                                                                                         |           `getDuration()`            |   `0` if the typing has yet to start.    |
