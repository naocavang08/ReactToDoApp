/* eslint-disable react-hooks/purity */
import { useState, useEffect } from "react";

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>❌</button>
    </li>
  );
}

function TodoList({ todos, onToggle, onDelete }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default function TodoGame() {
  const [history, setHistory] = useState([[]]);
  const [currentStep, setCurrentStep] = useState(0);
  const currentTodos = history[currentStep];

  const [text, setText] = useState("");

  useEffect(() => {
    console.log("Todos changed:", currentTodos);
    localStorage.setItem("todo-history", JSON.stringify(history));
  }, [history, currentTodos]);

  useEffect(() => {
    const saved = localStorage.getItem("todo-history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  function addTodo() {
    if (!text.trim()) return;

    const newTodos = [...currentTodos, { id: Date.now(), text, done: false }];

    pushToHistory(newTodos);
    setText("");
  }

  function toggleTodo(id) {
    const newTodos = currentTodos.map((todo) =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    );

    pushToHistory(newTodos);
  }

  function deleteTodo(id) {
    const newTodos = currentTodos.filter((todo) => todo.id !== id);
    pushToHistory(newTodos);
  }

  function pushToHistory(newTodos) {
    const nextHistory = [...history.slice(0, currentStep + 1), newTodos];
    setHistory(nextHistory);
    setCurrentStep(nextHistory.length - 1);
  }

  function jumpTo(step) {
    setCurrentStep(step);
  }

  function undo() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  function redo() {
    if (currentStep < history.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  return (
    <div className="todo-container">
      <div className="todo-card">
        <h2>Todo App</h2>

        <button
          className="undo-btn"
          onClick={undo}
          disabled={currentStep === 0}
        >
          Undo
        </button>

        <button
          className="redo-btn"
          onClick={redo}
          disabled={currentStep === history.length - 1}
        >
          Redo
        </button>

        <div className="todo-input">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter todo..."
          />
          <button onClick={addTodo}>Add</button>
        </div>

        <ul>
          {currentTodos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span className={`todo-text ${todo.done ? "done" : ""}`}>
                {todo.text}
              </span>
              <button onClick={() => deleteTodo(todo.id)}>❌</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="history-card">
        <h3>History</h3>
        <ol>
          {history.map((_, index) => (
            <li key={index}>
              <button onClick={() => jumpTo(index)}>
                {index === 0 ? "Start" : `Step ${index}`}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
