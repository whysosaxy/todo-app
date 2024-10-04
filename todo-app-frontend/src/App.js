import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({ title: '', description: '' });
    const [editingTodo, setEditingTodo] = useState(null);
    const [updatedTodo, setUpdatedTodo] = useState({ title: '', description: '' });

    // Fetch todos from the backend
    const fetchTodos = async () => {
        const response = await axios.get('http://localhost:8080/todos');
        setTodos(response.data);
    };

    // Create a new todo
    const addTodo = async () => {
        if (newTodo.title && newTodo.description) {
            const response = await axios.post('http://localhost:8080/todos', newTodo);
            setTodos([...todos, response.data]);
            setNewTodo({ title: '', description: '' });
        }
    };

    // Delete a todo
    const deleteTodo = async (id) => {
        await axios.delete(`http://localhost:8080/todos/${id}`);
        setTodos(todos.filter(todo => todo.id !== id));
    };

    // Start editing a todo
    const startEditing = (todo) => {
        setEditingTodo(todo.id);
        setUpdatedTodo({ title: todo.title, description: todo.description });
    };

    // Update a todo
    const updateTodo = async (id) => {
        if (editingTodo) {
            const todoToUpdate = todos.find(todo => todo.id === id);
            const updatedData = { ...todoToUpdate, ...updatedTodo };
            await axios.put(`http://localhost:8080/todos/${id}`, updatedData);
            setTodos(todos.map(todo => (todo.id === id ? updatedData : todo)));
            setEditingTodo(null); // Reset editing state
            setUpdatedTodo({ title: '', description: '' }); // Reset input fields
        }
    };

    // Toggle completed status
    const toggleTodo = async (id) => {
        const todoToToggle = todos.find(todo => todo.id === id);
        const updatedData = { ...todoToToggle, completed: !todoToToggle.completed };
        await axios.put(`http://localhost:8080/todos/${id}`, updatedData);
        setTodos(todos.map(todo => (todo.id === id ? updatedData : todo)));
    };

    // Fetch todos on component mount
    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center">Todo App</h1>
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Title"
                    value={newTodo.title}
                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                />
                <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="Description"
                    value={newTodo.description}
                    onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                />
                <button className="btn btn-primary mt-2" onClick={addTodo}>Add Todo</button>
            </div>
            <ul className="list-group">
                {todos.length === 0 ? (
                    <li className="list-group-item">No todos available.</li>
                ) : (
                    todos.map(todo => (
                        <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h5>{todo.title}</h5>
                                <p>{todo.description}</p>
                                <span className={`badge ${todo.completed ? 'bg-success' : 'bg-warning'}`}>
                                    Status: {todo.completed ? 'Completed' : 'Pending'}
                                </span>
                            </div>
                            <div>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => toggleTodo(todo.id)}>
                                    {todo.completed ? 'Mark as Pending' : 'Mark as Completed'}
                                </button>
                                <button className="btn btn-danger btn-sm me-2" onClick={() => deleteTodo(todo.id)}>Delete</button>
                                <button className="btn btn-info btn-sm" onClick={() => startEditing(todo)}>Edit</button>
                            </div>
                            {editingTodo === todo.id && (
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="New Title"
                                        value={updatedTodo.title}
                                        onChange={(e) => setUpdatedTodo({ ...updatedTodo, title: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="form-control mt-2"
                                        placeholder="New Description"
                                        value={updatedTodo.description}
                                        onChange={(e) => setUpdatedTodo({ ...updatedTodo, description: e.target.value })}
                                    />
                                    <button className="btn btn-success mt-2" onClick={() => updateTodo(todo.id)}>Save</button>
                                </div>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default App;
