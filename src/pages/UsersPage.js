import { useState, useEffect } from 'react';
import DataTable from '../DataTable';
import * as Yup from 'yup';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error('Failed to load users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    website: Yup.string().url('Invalid URL').required('Website is required')
  });

  const formFields = [
    { name: 'name', label: 'Full Name' },
    { name: 'username', label: 'Username' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone' },
    { name: 'website', label: 'Website' }
  ];

  const handleAdd = async (newUser) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();
      setUsers([...users, data]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (ids) => {
    try {
      await Promise.all(ids.map(id => 
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
          method: 'DELETE',
        })
      ));
      setUsers(users.filter(user => !ids.includes(user.id)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id, updatedUser) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedUser),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();
      setUsers(users.map(user => user.id === id ? data : user));
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <DataTable
      data={users}
      columns={[
        { key: 'id', title: 'ID' },
        { key: 'name', title: 'Name' },
        { key: 'username', title: 'Username' },
        { key: 'email', title: 'Email' },
        { key: 'phone', title: 'Phone' },
        { key: 'website', title: 'Website' }
      ]}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
      validationSchema={validationSchema}
      initialValues={{ 
        name: '', 
        username: '', 
        email: '', 
        phone: '', 
        website: '' 
      }}
      formFields={formFields}
    />
  );
};

export default UsersPage;