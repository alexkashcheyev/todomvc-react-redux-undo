import React from "react";
import PropTypes from "prop-types";
import TodoTextInput from "./TodoTextInput";
import UndoRedoIcon from "./UndoRedoIcon";

const undoRedoIconsContainerStyle = {
  margin: "auto",
  top: 10,
  right: 0,
  position: "absolute",
  cursor: "pointer"
};

const Header = ({ addTodo, undo, redo }) => (
  <header className="header">
    <h1>todos</h1>
    <TodoTextInput
      newTodo
      onSave={(text) => {
        if (text.length !== 0) {
          addTodo(text);
        }
      }}
      placeholder="What needs to be done?"
    />
    <div style={undoRedoIconsContainerStyle}>
      <UndoRedoIcon undo onClick={() => undo()} />
      <UndoRedoIcon redo onClick={() => redo()} />
    </div>
  </header>
);

Header.propTypes = {
  addTodo: PropTypes.func.isRequired
};

export default Header;
