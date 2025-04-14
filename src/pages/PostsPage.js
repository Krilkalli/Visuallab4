import { useState, useEffect } from 'react';
import DataTable from '../DataTable';
import * as Yup from 'yup';

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) throw new Error('Failed to load posts');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    body: Yup.string().required('Content is required'),
    userId: Yup.number().required('User ID is required').positive('Must be positive')
  });

  const formFields = [
    { name: 'userId', label: 'User ID', type: 'number' },
    { name: 'title', label: 'Title' },
    { name: 'body', label: 'Content', type: 'textarea' }
  ];

  const handleAdd = async (newPost) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();
      setPosts([...posts, data]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (ids) => {
    try {
      await Promise.all(ids.map(id => 
        fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
          method: 'DELETE',
        })
      ));
      setPosts(posts.filter(post => !ids.includes(post.id)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id, updatedPost) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedPost),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();
      setPosts(posts.map(post => post.id === id ? data : post));
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <DataTable
      data={posts}
      columns={[
        { key: 'id', title: 'ID' },
        { key: 'userId', title: 'User ID' },
        { key: 'title', title: 'Title' },
        { key: 'body', title: 'Content' }
      ]}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
      validationSchema={validationSchema}
      initialValues={{ userId: 1, title: '', body: '' }}
      formFields={formFields}
    />
  );
};

export default PostsPage;