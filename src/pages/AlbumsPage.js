import { useState, useEffect } from 'react';
import DataTable from '../DataTable';
import * as Yup from 'yup';

const AlbumsPage = () => {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/albums');
        if (!response.ok) throw new Error('Failed to load albums');
        const data = await response.json();
        setAlbums(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    userId: Yup.number().required('User ID is required').positive('Must be positive')
  });

  const formFields = [
    { name: 'userId', label: 'User ID', type: 'number' },
    { name: 'title', label: 'Title' }
  ];

  const handleAdd = async (newAlbum) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/albums', {
        method: 'POST',
        body: JSON.stringify(newAlbum),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();
      setAlbums([...albums, data]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (ids) => {
    try {
      await Promise.all(ids.map(id => 
        fetch(`https://jsonplaceholder.typicode.com/albums/${id}`, {
          method: 'DELETE',
        })
      ));
      setAlbums(albums.filter(album => !ids.includes(album.id)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id, updatedAlbum) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/albums/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedAlbum),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();
      setAlbums(albums.map(album => album.id === id ? data : album));
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <div className="loading">Loading albums...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <DataTable
      data={albums}
      columns={[
        { key: 'id', title: 'ID' },
        { key: 'userId', title: 'User ID' },
        { key: 'title', title: 'Title' }
      ]}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
      validationSchema={validationSchema}
      initialValues={{ userId: 1, title: '' }}
      formFields={formFields}
    />
  );
};

export default AlbumsPage;