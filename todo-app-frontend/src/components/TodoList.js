import React, { useEffect, useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/todos')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setTodos(data);
      })
      .catch((error) => {
        console.error('Error fetching todos:', error);
        setError(error.message);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Todo List</h2>
      <ul>
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li key={todo.id}>
              <h3>{todo.title}</h3>
              <p>{todo.description}</p>
              <p>Status: {todo.completed ? 'Completed' : 'Incomplete'}</p>
            </li>
          ))
        ) : (
          <p>No todos available.</p>
        )}
      </ul>
    </div>
  );
}

export default TodoList;
