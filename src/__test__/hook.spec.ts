import { renderHook, act } from '@testing-library/react-hooks';
import useTypingTest from '../index';

describe('useTypingPractice hook tests', () => {
  const test = 'The quick brown fox jumps over the lazy dog';
  const initialState = {
    startTime: null,
    endTime: null,
    chars: 'The quick brown fox jumps over the lazy dog',
    // prettier-ignore
    charsState: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0
    ],
    length: 43,
    currIndex: -1,
    currChar: '',
    correctChar: 0,
    errorChar: 0,
    phase: 0,
    skipCurrentWordOnSpace: true,
    pauseOnError: false,
  };

  it('should render initial states properly', () => {
    const { result } = renderHook(() => useTypingTest(test));
    expect(result.current.states).toEqual(initialState);
  });

  it('should update when correct character is entered', () => {
    const { result } = renderHook(() => useTypingTest(test));
    act(() => {
      result.current.actions.insertTyping('T');
    });
    expect(result.current.states.charsState).toEqual(
      // prettier-ignore
      [
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0
      ]
    );
    expect(result.current.states.correctChar).toBe(1);
    expect(result.current.states.errorChar).toBe(0);
    expect(result.current.states.currChar).toBe('T');
    expect(result.current.states.phase).toBe(1);
    expect(result.current.states.currIndex).toBe(0);
    expect(result.current.states.startTime).not.toBe(null);
  });

  it('should update when incorrect character is entered', () => {
    const { result } = renderHook(() => useTypingTest(test));
    act(() => {
      result.current.actions.insertTyping('Q');
    });
    expect(result.current.states.charsState).toEqual(
      // prettier-ignore
      [
        2, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0
      ]
    );
    expect(result.current.states.correctChar).toBe(0);
    expect(result.current.states.errorChar).toBe(1);
    expect(result.current.states.currChar).toBe('T');
    expect(result.current.states.phase).toBe(1);
    expect(result.current.states.currIndex).toBe(0);
    expect(result.current.states.startTime).not.toBe(null);
  });

  it('should update after deleting a character', () => {
    const { result } = renderHook(() => useTypingTest(test));
    act(() => {
      result.current.actions.insertTyping('Q');
      result.current.actions.deleteTyping();
    });
    expect(result.current.states.charsState).toEqual(
      // prettier-ignore
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0
      ]
    );
    expect(result.current.states.correctChar).toBe(0);
    expect(result.current.states.errorChar).toBe(0);
    expect(result.current.states.currChar).toBe('');
    expect(result.current.states.phase).toBe(1);
    expect(result.current.states.currIndex).toBe(-1);
    expect(result.current.states.startTime).not.toBe(null);
  });

  it('should update after deleting a word', () => {
    const { result } = renderHook(() => useTypingTest(test));
    act(() => {
      result.current.actions.insertTyping('T');
      result.current.actions.insertTyping('H');
      result.current.actions.insertTyping('W');
      result.current.actions.deleteTyping(true);
    });
    expect(result.current.states.charsState).toEqual(
      // prettier-ignore
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0
      ]
    );
    expect(result.current.states.correctChar).toBe(0);
    expect(result.current.states.errorChar).toBe(0);
    expect(result.current.states.currChar).toBe('');
    expect(result.current.states.phase).toBe(1);
    expect(result.current.states.currIndex).toBe(-1);
    expect(result.current.states.startTime).not.toBe(null);
  });

  it('should end when typed finish(no errors in typing)', () => {
    const { result } = renderHook(() => useTypingTest(test));
    act(() => {
      test.split('').forEach(letter => {
        result.current.actions.insertTyping(letter);
      });
    });
    expect(result.current.states.charsState).toEqual(
      // prettier-ignore
      [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1
      ]
    );
    expect(result.current.states.correctChar).toBe(43);
    expect(result.current.states.errorChar).toBe(0);
    expect(result.current.states.currChar).toBe('g');
    expect(result.current.states.phase).toBe(2);
    expect(result.current.states.currIndex).toBe(42);
    expect(result.current.states.startTime).not.toBe(null);
    expect(result.current.states.endTime).not.toBe(null);
  });

  it('should end when typed finish(some errors in typing)', () => {
    const { result } = renderHook(() => useTypingTest(test));
    act(() => {
      test.split('').forEach(letter => {
        if (Math.random() < 0.6) {
          result.current.actions.insertTyping(letter);
        } else {
          result.current.actions.insertTyping('1');
        }
      });
    });
    expect(result.current.states.charsState).not.toEqual(
      // prettier-ignore
      [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1
      ]
    );
    expect(result.current.states.correctChar).not.toBe(43);
    expect(result.current.states.errorChar).not.toBe(0);
    expect(result.current.states.currChar).toBe('g');
    expect(result.current.states.phase).toBe(2);
    expect(result.current.states.currIndex).toBe(42);
    expect(result.current.states.startTime).not.toBe(null);
    expect(result.current.states.endTime).not.toBe(null);
  });

  it('should end when typed finish(all errors in typing)', () => {
    const { result } = renderHook(() => useTypingTest(test));
    act(() => {
      test.split('').forEach(() => {
        result.current.actions.insertTyping('1');
      });
    });
    expect(result.current.states.charsState).toEqual(
      // prettier-ignore
      [
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2
      ]
    );
    expect(result.current.states.correctChar).toBe(0);
    expect(result.current.states.errorChar).toBe(43);
    expect(result.current.states.currChar).toBe('g');
    expect(result.current.states.phase).toBe(2);
    expect(result.current.states.currIndex).toBe(42);
    expect(result.current.states.startTime).not.toBe(null);
    expect(result.current.states.endTime).not.toBe(null);
  });

  it('allows for setting of current index', () => {
    const { result } = renderHook(() => useTypingTest(test));
    act(() => {
      result.current.actions.insertTyping('T');
      result.current.actions.setCurrIndex(4);
    });
  });

  it('can reset', () => {
    const { result } = renderHook(() => useTypingTest(test));
    act(() => {
      result.current.actions.insertTyping('T');
      result.current.actions.resetTyping();
    });
    expect(result.current.states).toEqual(initialState);
  });

  it('can end', () => {
    const { result } = renderHook(() => useTypingTest(test));
    act(() => {
      result.current.actions.insertTyping('T');
      result.current.actions.endTyping();
    });
    expect(result.current.states.phase).toBe(2);
  });

  it('works for option skipCurrentWordOnSpace', () => {
    let { result } = renderHook(() =>
      useTypingTest(test, { skipCurrentWordOnSpace: true })
    );
    act(() => {
      result.current.actions.insertTyping(' ');
      result.current.actions.insertTyping('q');
    });
    expect(result.current.states.charsState).toEqual(
      // prettier-ignore
      [
        0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0
      ]
    );
    expect(result.current.states.correctChar).toBe(1);
    expect(result.current.states.errorChar).toBe(0);
    expect(result.current.states.currChar).toBe('q');
    expect(result.current.states.phase).toBe(1);
    expect(result.current.states.currIndex).toBe(4);
    expect(result.current.states.startTime).not.toBe(null);
    expect(result.current.states.endTime).toBe(null);

    let { result: res } = renderHook(() =>
      useTypingTest(test, { skipCurrentWordOnSpace: false })
    );

    act(() => {
      res.current.actions.insertTyping(' ');
      res.current.actions.insertTyping('q');
    });

    expect(res.current.states.charsState).toEqual(
      // prettier-ignore
      [
        2, 2, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0
      ]
    );
    expect(res.current.states.correctChar).toBe(0);
    expect(res.current.states.errorChar).toBe(2);
    expect(res.current.states.currChar).toBe('h');
    expect(res.current.states.phase).toBe(1);
    expect(res.current.states.currIndex).toBe(1);
    expect(res.current.states.startTime).not.toBe(null);
    expect(res.current.states.endTime).toBe(null);
  });

  it('works for option pauseOnError', () => {
    let { result } = renderHook(() =>
      useTypingTest(test, { pauseOnError: true })
    );
    act(() => {
      result.current.actions.insertTyping('q');
    });
    expect(result.current.states.charsState).toEqual(
      // prettier-ignore
      [
        2, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0
      ]
    );
    expect(result.current.states.correctChar).toBe(0);
    expect(result.current.states.errorChar).toBe(1);
    expect(result.current.states.currChar).toBe('');
    expect(result.current.states.phase).toBe(1);
    expect(result.current.states.currIndex).toBe(-1);
    expect(result.current.states.startTime).not.toBe(null);
    expect(result.current.states.endTime).toBe(null);

    let { result: res } = renderHook(() =>
      useTypingTest(test, { pauseOnError: false })
    );

    act(() => {
      res.current.actions.insertTyping('q');
    });

    expect(res.current.states.charsState).toEqual(
      // prettier-ignore
      [
        2, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0
      ]
    );
    expect(res.current.states.correctChar).toBe(0);
    expect(res.current.states.errorChar).toBe(1);
    expect(res.current.states.currChar).toBe('T');
    expect(res.current.states.phase).toBe(1);
    expect(res.current.states.currIndex).toBe(0);
    expect(res.current.states.startTime).not.toBe(null);
    expect(res.current.states.endTime).toBe(null);
  });
});
