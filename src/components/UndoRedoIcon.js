import React from "react";

function UndoRedoIcon({ undo = false, redo = false, onClick = () => {} }) {
  if (undo === redo) return null;
  const transform = redo ? "scale(-1 1) translate(-40.5 0)" : "";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40.5"
      height="40.5"
      viewBox="-5 -5 55.5 55.5"
      onClick={onClick}
    >
      <g transform={transform}>
        <path d="M40.5 20.25c0 9.374-7.625 17-17 17a3 3 0 010-6c6.064 0 11-4.936 11-11 0-6.065-4.936-11-11-11-5.756 0-10.486 4.447-10.953 10.086l1.832-1.832a2.998 2.998 0 014.242 0 2.998 2.998 0 010 4.242l-6.75 6.75a2.996 2.996 0 01-4.242 0l-6.75-6.75a3 3 0 114.243-4.242l1.444 1.444c.669-8.766 8-15.698 16.934-15.698 9.375 0 17 7.626 17 17z"></path>
      </g>
    </svg>
  );
}

export default UndoRedoIcon;
