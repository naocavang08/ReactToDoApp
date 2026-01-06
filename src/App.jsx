import { useEffect, useState } from "react";
import ToDoApi from "./Api/ToDoApi";
import { ToDoDto } from "./Dto/ToDoDto";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    try {
      setLoading(true);
      const data = await ToDoApi.getAll();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to load todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function addTodo() {
    if (!text.trim()) return;

    try {
      const newTodoDto = new ToDoDto(0, text.trim(), false);
      const createdTodo = await ToDoApi.create(newTodoDto);
      
      // Optimistic update - thêm vào state ngay
      setTodos(prevTodos => [...prevTodos, createdTodo]);
      setText("");
      setError(null);
    } catch (err) {
      setError('Failed to add todo');
      console.error(err);
      // Reload nếu có lỗi
      await loadTodos();
    }
  }

  async function toggleTodo(id) {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      // Optimistic update
      setTodos(prevTodos => 
        prevTodos.map(t => 
          t.id === id ? { ...t, isComplete: !t.isComplete } : t
        )
      );

      const updatedTodo = new ToDoDto(todo.id, todo.name, !todo.isComplete);
      await ToDoApi.update(id, updatedTodo);
      setError(null);
    } catch (err) {
      setError('Failed to toggle todo');
      console.error(err);
      // Rollback nếu có lỗi
      await loadTodos();
    }
  }

  async function deleteTodo(id) {
    try {
      // Optimistic update
      setTodos(prevTodos => prevTodos.filter(t => t.id !== id));
      
      await ToDoApi.delete(id);
      setError(null);
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
      // Rollback nếu có lỗi
      await loadTodos();
    }
  }

  if (loading) {
    return (
      <div className="todo-container">
        <div className="todo-card">Loading...</div>
      </div>
    );
  }

  return (
    <div className="todo-container">
      <div className="todo-card">
        <h2>Todo App</h2>

        {error && (
          <div style={{ 
            color: 'red', 
            marginBottom: '10px', 
            padding: '10px', 
            backgroundColor: '#fee',
            borderRadius: '4px' 
          }}>
            {error}
          </div>
        )}

        <div className="todo-input">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Enter todo..."
          />
          <button onClick={addTodo}>Add</button>
        </div>

        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <input
                type="checkbox"
                checked={todo.isComplete}
                onChange={() => toggleTodo(todo.id)}
              />
              <span className={`todo-text ${todo.isComplete ? "done" : ""}`}>
                {todo.name}
              </span>
              <button onClick={() => deleteTodo(todo.id)}>❌</button>
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
            No todos yet. Add one above!
          </p>
        )}
      </div>
    </div>
  );
}