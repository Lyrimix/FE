import { INPUT } from "./constant";

const numberRegex = /^[0-9]$/;

export const isNumberKey = (key) => numberRegex.test(key);

export const isNavigationKey = (key) =>
  key === INPUT.ARROW_LEFT || key === INPUT.ARROW_RIGHT;

export const isDeleteKey = (key) =>
  key === INPUT.BACKSPACE || key === INPUT.DELETE;

export const isInvalidCursor = (cursor, maskChars, valueLength) =>
  maskChars.includes(cursor) || cursor >= valueLength;

export const moveCursor = (pos, inputRef) => {
  // setTimeout to delay cursor movement until after the current event loop.
  setTimeout(() => {
    inputRef.current.setSelectionRange(pos, pos + 1);
  }, 0);
};

export const replaceCharAt = (value, index, newChar) => {
  const chars = value.split("");
  chars[index] = newChar;
  return chars.join("");
};

export const getNextEditablePos = (startPos, maskChars, valueLength) => {
  let pos = startPos;
  while (maskChars.includes(pos) && pos < valueLength) {
    pos++;
  }
  return pos;
};

export const getPrevEditablePos = (startPos, maskChars) => {
  let pos = startPos;
  while (maskChars.includes(pos) && pos >= 0) {
    pos--;
  }
  return pos;
};
