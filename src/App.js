import { useState, useEffect } from 'react';
import DataSet from './DataSet';
import { useOptimistic } from './useOptimistic';

const API_URL = 'https://jsonplaceholder.typicode.com/comments';

export default function App() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, action) => {
      switch (action.type) {
        case 'add':
          return [...state, action.payload];
        case 'delete':
          return state.filter(comment => !action.payload.includes(comment.id));
        case 'update':
          return state.map(comment => 
            comment.id === action.payload.id ? action.payload : comment
          );
        default:
          return state;
      }
    }
  );

  // Загрузка данных при монтировании
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchComments();
  }, []);

  // Обработчик добавления комментария
  const handleAddComment = async (newComment) => {
    try {
      // Оптимистичное обновление
      addOptimisticComment({
        type: 'add',
        payload: { ...newComment, id: Date.now() } // Временный ID
      });

      // Отправка на сервер
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(newComment),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (!response.ok) throw new Error('Failed to add comment');

      const data = await response.json();
      
      // Заменяем временный ID на реальный
      setComments(prev => prev.map(comment => 
        comment.id === newComment.id ? data : comment
      ));
    } catch (err) {
      // Откатываем изменения при ошибке
      setComments(prev => prev.filter(comment => comment.id !== newComment.id));
      alert('Failed to add comment: ' + err.message);
    }
  };

  // Обработчик удаления комментариев
  const handleDeleteComments = async () => {
    if (selectedRows.length === 0) return;
    
    try {
      // Оптимистичное обновление
      addOptimisticComment({
        type: 'delete',
        payload: selectedRows
      });

      // Отправка на сервер
      const deletePromises = selectedRows.map(id => 
        fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      );
      
      const results = await Promise.all(deletePromises);
      const allOk = results.every(res => res.ok);
      
      if (!allOk) throw new Error('Some deletions failed');

      // Обновляем состояние после успешного удаления
      setComments(prev => prev.filter(comment => !selectedRows.includes(comment.id)));
      setSelectedRows([]);
    } catch (err) {
      // Восстанавливаем данные при ошибке
      setComments(optimisticComments);
      alert('Failed to delete comments: ' + err.message);
    }
  };

  // Обработчик обновления комментария
  const handleUpdateComment = async (updatedComment) => {
    try {
      // Оптимистичное обновление
      addOptimisticComment({
        type: 'update',
        payload: updatedComment
      });

      // Отправка на сервер
      const response = await fetch(`${API_URL}/${updatedComment.id}`, {
        method: 'PATCH',
        body: JSON.stringify(updatedComment),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (!response.ok) throw new Error('Failed to update comment');

      // Обновляем состояние после успешного обновления
      setComments(prev => prev.map(comment => 
        comment.id === updatedComment.id ? updatedComment : comment
      ));
    } catch (err) {
      // Восстанавливаем данные при ошибке
      setComments(optimisticComments);
      alert('Failed to update comment: ' + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="app">
      <h1>Comments Table</h1>
      <div className="controls">
        <button 
          onClick={handleDeleteComments} 
          disabled={selectedRows.length === 0}
        >
          Delete Selected
        </button>
      </div>
      <DataSet
        data={optimisticComments}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name', editable: true },
          { key: 'email', label: 'Email', editable: true },
          { key: 'body', label: 'Body', editable: true }
        ]}
        onAdd={handleAddComment}
        onUpdate={handleUpdateComment}
        selectedRows={selectedRows}
        onSelect={setSelectedRows}
      />
    </div>
  );
}