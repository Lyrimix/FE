import React, { useRef } from "react";
import { INPUT } from "../../utils/constant";
import {
  isNumberKey,
  isNavigationKey,
  isDeleteKey,
  isInvalidCursor,
  moveCursor,
  replaceCharAt,
  getNextEditablePos,
  getPrevEditablePos,
} from "../../utils/timeInputUtils";

const TimeInput = ({ value, onChange, className }) => {
  const inputRef = useRef(null);

  const fixedFormat = INPUT.TIME_DEFAULT;

  // Positions of characters like ":" or "."
  const maskChars = [1, 4, 7];

  // Handle keyboard events
  const handleKeyDown = (e) => {
    const key = e.key;
    const cursor = e.target.selectionStart;

    // Handle Backspace/Delete key: replace the current digit with '0'
    if (isDeleteKey(key)) {
      e.preventDefault();
      if (isInvalidCursor(cursor, maskChars, value.length)) return;
      const newValue = replaceCharAt(value, cursor, "0");
      onChange({ target: { value: newValue } });
      return;
    }
    // Check if current cursor position is 2 or 5, not input >5
    if ((cursor === 2 || cursor === 5) && key > "5") {
      e.preventDefault();
      return;
    }

    // Handle number keys: replace the current digit and move to the next digit
    if (isNumberKey(key)) {
      e.preventDefault();
      if (isInvalidCursor(cursor, maskChars, value.length)) return;
      const newValue = replaceCharAt(value, cursor, key);
      onChange({ target: { value: newValue } });

      const nextPos = getNextEditablePos(cursor + 1, maskChars, value.length);
      if (nextPos < value.length) {
        moveCursor(nextPos, inputRef);
      }
      return;
    }

    // Handle arrow keys left/right: move to previous/next position
    if (isNavigationKey(key)) {
      e.preventDefault();
      const pos =
        key === INPUT.ARROW_RIGHT
          ? getNextEditablePos(cursor + 1, maskChars, value.length)
          : getPrevEditablePos(cursor - 1, maskChars);
      moveCursor(pos, inputRef);
      return;
    }

    // Prevent other key
    e.preventDefault();
  };

  // Cursor always lands on editable digit when clicking
  const handleClick = (e) => {
    let cursor = e.target.selectionStart;
    if ([cursor, cursor + 1].some((pos) => maskChars.includes(pos))) {
      while (maskChars.includes(cursor)) cursor++;
    }
    moveCursor(cursor, inputRef);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      value={value}
      className={`font-mono ${className}`}
      onChange={() => {}} // Disable manual input
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      maxLength={fixedFormat.length}
    />
  );
};

export default TimeInput;
