import { useState, useEffect } from 'react';
import CommentList from './CommentList';
import './styles.css';

export default function CommentManager() {
  const [commentData, setCommentData] = useState([]);
  const [uiComments, setUiComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [newIdCounter, setNewIdCounter] = useState(501); 

  useEffect(() => {
    async function loadComments() {
      try {
        const result = await fetch('http://localhost:5148/comments');
        
        if (!result.ok) {
          throw new Error('Не удалось загрузить комментарии');
        }
        
        const jsonData = await result.json();
        setCommentData(jsonData);
        setUiComments(jsonData);
        
        const highestId = jsonData.reduce((max, item) => Math.max(max, item.id), 0);
        setNewIdCounter(highestId + 1);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Произошла ошибка');
      } finally {
        setIsLoading(false);
      }
    }

    loadComments();
  }, []);

  const computePostId = (index) => {
    return Math.floor((index - 1) / 5) + 1;
  };

  const addComment = async (comment) => {
    const temporaryId = newIdCounter;
    const commentToAdd = { 
      ...comment, 
      id: temporaryId,
      postId: computePostId(uiComments.length + 1) 
    };
    
    setNewIdCounter(prev => prev + 1);
    setUiComments(prev => [...prev, commentToAdd]);
    
    try {
      const response = await fetch('http://localhost:5148/comments', {
        method: 'POST',
        body: JSON.stringify(commentToAdd),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при добавлении');
      }
      
      const createdComment = await response.json();
      
      setCommentData(prev => [...prev, createdComment]);
      setNewIdCounter(prev => Math.max(prev, createdComment.id + 1));
    } catch (err) {
      setUiComments(prev => prev.filter(c => c.id !== temporaryId));
      setErrorMessage(err instanceof Error ? err.message : 'Ошибка добавления');
    }
  };

  const removeComments = async (ids) => {
    const previousState = [...uiComments];
    setUiComments(prev => prev.filter(c => !ids.includes(c.id)));
    //http://localhost:5148/comments
    //https://jsonplaceholder.typicode.com/comments/${id}
    try {
      const results = await Promise.all(
        ids.map(id => 
          fetch(`http://localhost:5148/comments/${id}`, {
            method: 'DELETE',
          })
        )
      );
      
      const success = results.every(r => r.ok);
      if (!success) {
        throw new Error('Ошибка удаления');
      }
      
      setCommentData(prev => prev.filter(c => !ids.includes(c.id)));
    } catch (err) {
      setUiComments(previousState);
      setErrorMessage(err instanceof Error ? err.message : 'Не удалось удалить');
    }
  };

  const modifyComment = async (id, changes) => {
    const originalComment = uiComments.find(c => c.id === id);
    setUiComments(prev => prev.map(c => c.id === id ? {...c, ...changes} : c));
    
    try {
      const response = await fetch(`http://localhost:5148/comments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(changes),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      
      if (!response.ok) {
        throw new Error('Ошибка обновления');
      }
      
      const updated = await response.json();
      setCommentData(prev => prev.map(c => c.id === id ? updated : c));
    } catch (err) {
      setUiComments(prev => prev.map(c => c.id === id ? originalComment : c));
      setErrorMessage(err instanceof Error ? err.message : 'Ошибка изменения');
    }
  };

  if (isLoading) {
    return <div className="loading-container">loading...</div>;
  }

  if (errorMessage) {
    return <div className="error-container">Error: {errorMessage}</div>;
  }

  return (
    <div className="app-container">
      <div className="comment-manager">
        <header className="app-header">
          <h1>Spisok</h1>
        </header>
        <CommentList 
          comments={uiComments}
          onAdd={addComment}
          onDelete={removeComments}
          onUpdate={modifyComment}
        />
        {errorMessage && <div className="error-notification">{errorMessage}</div>}
      </div>
    </div>
  );
}