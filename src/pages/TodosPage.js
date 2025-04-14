import { useState, useEffect } from 'react';
import DataTable from '../DataTable';
import * as Yup from 'yup';

const TodosPage = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        if (!response.ok) throw new Error('Failed to load todos');
        const data = await response.json();
        setTodos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    completed: Yup.boolean().required('Status is required'),
    userId: Yup.number().required('User ID is required').positive('Must be positive')
  });

  const formFields = [
    { name: 'userId', label: 'User ID', type: 'number' },
    { name: 'title', label: 'Title' },
    { name: 'completed', label: 'Completed', type: 'checkbox' }
  ];

  const handleAdd = async (newTodo) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(newTodo),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();
      setTodos([...todos, data]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (ids) => {
    try {
      await Promise.all(ids.map(id => 
        fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
          method: 'DELETE',
        })
      ));
      setTodos(todos.filter(todo => !ids.includes(todo.id)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id, updatedTodo) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedTodo),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();
      setTodos(todos.map(todo => todo.id === id ? data : todo));
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <div className="loading">Loading todos...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <DataTable
      data={todos}
      columns={[
        { key: 'id', title: 'ID' },
        { key: 'userId', title: 'User ID' },
        { key: 'title', title: 'Title' },
        { key: 'completed', title: 'Completed', type: 'boolean' }
      ]}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
      validationSchema={validationSchema}
      initialValues={{ userId: 1, title: '', completed: false }}
      formFields={formFields}
    />
  );
};

export default TodosPage;