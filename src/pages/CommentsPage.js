import { useState, useEffect } from 'react';
import DataTable from '../DataTable';
import * as Yup from 'yup';

const CommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/comments');
        if (!response.ok) throw new Error('Failed to load comments');
        const data = await response.json();
        setComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    body: Yup.string().required('Comment text is required'),
    postId: Yup.number().required('Post ID is required').positive('Must be positive')
  });

  const formFields = [
    { name: 'postId', label: 'Post ID', type: 'number' },
    { name: 'name', label: 'Name' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'body', label: 'Comment', type: 'textarea' }
  ];

  const handleAdd = async (newComment) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/comments', {
        method: 'POST',
        body: JSON.stringify(newComment),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();
      setComments([...comments, data]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (ids) => {
    try {
      await Promise.all(ids.map(id => 
        fetch(`https://jsonplaceholder.typicode.com/comments/${id}`, {
          method: 'DELETE',
        })
      ));
      setComments(comments.filter(comment => !ids.includes(comment.id)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id, updatedComment) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedComment),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();
      setComments(comments.map(comment => comment.id === id ? data : comment));
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <div className="loading">Loading comments...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <DataTable
      data={comments}
      columns={[
        { key: 'id', title: 'ID' },
        { key: 'postId', title: 'Post ID' },
        { key: 'name', title: 'Name' },
        { key: 'email', title: 'Email' },
        { key: 'body', title: 'Comment' }
      ]}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
      validationSchema={validationSchema}
      initialValues={{ postId: 1, name: '', email: '', body: '' }}
      formFields={formFields}
    />
  );
};

export default CommentsPage;