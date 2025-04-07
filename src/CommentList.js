import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CommentList = ({ comments, onAdd, onDelete, onUpdate }) => {
  const [selectedComments, setSelectedComments] = useState([]);
  const [newCommentData, setNewCommentData] = useState({
    postId: 1,
    name: '',
    email: '',
    content: ''
  });
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleAddComment = () => {
    if (!newCommentData.name || !newCommentData.content) {
      alert('Заполните обязательные поля');
      return;
    }
    onAdd(newCommentData);
    setNewCommentData({
      postId: 1,
      name: '',
      email: '',
      content: ''
    });
  };

  const handleDelete = () => {
    if (selectedComments.length > 0) {
      if (window.confirm(`Удалить ${selectedComments.length} комментариев?`)) {
        onDelete(selectedComments);
        setSelectedComments([]);
      }
    }
  };

  const startEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditFormData({
      name: comment.name,
      email: comment.email,
      content: comment.body
    });
  };

  const saveChanges = () => {
    if (editingCommentId) {
      onUpdate(editingCommentId, editFormData);
      setEditingCommentId(null);
    }
  };

  const tableHeaders = ['Выбрать', 'ID', 'Post ID', 'Имя', 'Email', 'Текст', 'Действия'];

  return (
    <div className="comment-list-container">
      <div className="add-comment-section">
        <h3>Добавить комментарий</h3>
        <div className="comment-form">
          <input
            type="number"
            value={newCommentData.postId}
            onChange={(e) => setNewCommentData({...newCommentData, postId: +e.target.value})}
            placeholder="Post ID"
            className="form-input"
          />
          <input
            value={newCommentData.name}
            onChange={(e) => setNewCommentData({...newCommentData, name: e.target.value})}
            placeholder="Имя"
            className="form-input"
            required
          />
          <input
            value={newCommentData.email}
            onChange={(e) => setNewCommentData({...newCommentData, email: e.target.value})}
            placeholder="Email"
            className="form-input"
          />
          <textarea
            value={newCommentData.content}
            onChange={(e) => setNewCommentData({...newCommentData, content: e.target.value})}
            placeholder="Текст комментария"
            className="form-textarea"
            required
          />
          <button 
            onClick={handleAddComment}
            className="add-button"
          >
            +
          </button>
        </div>
      </div>

      <div className="actions-container">
        <h3 className="comments-title">Список комментариев ({comments.length})</h3>
        <div className="action-buttons">
          <button 
            onClick={handleDelete}
            disabled={selectedComments.length === 0}
            className={`delete-button ${selectedComments.length ? '' : 'disabled'}`}
          >
            Удалить выбранные ({selectedComments.length})
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="comments-table">
          <thead>
            <tr>
              {tableHeaders.map((header, index) => (
                <th key={index} className="table-header">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comments.map(comment => (
              <tr 
                key={comment.id} 
                className={`table-row ${selectedComments.includes(comment.id) ? 'selected-row' : ''}`}
              >
                <td className="table-cell">
                  <input
                    type="checkbox"
                    checked={selectedComments.includes(comment.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedComments([...selectedComments, comment.id]);
                      } else {
                        setSelectedComments(selectedComments.filter(id => id !== comment.id));
                      }
                    }}
                    className="row-checkbox"
                  />
                </td>
                <td className="table-cell">{comment.id}</td>
                <td className="table-cell">{comment.postId}</td>
                <td className="table-cell">
                  {editingCommentId === comment.id ? (
                    <input
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                      className="edit-input"
                    />
                  ) : (
                    comment.name
                  )}
                </td>
                <td className="table-cell">
                  {editingCommentId === comment.id ? (
                    <input
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                      className="edit-input"
                    />
                  ) : (
                    comment.email
                  )}
                </td>
                <td className="table-cell">
                  {editingCommentId === comment.id ? (
                    <textarea
                      value={editFormData.content}
                      onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                      className="edit-textarea"
                    />
                  ) : (
                    comment.body
                  )}
                </td>
                <td className="table-cell actions-cell">
                  <div className="table-row-actions">
                    {editingCommentId === comment.id ? (
                      <>
                        <button 
                          onClick={saveChanges}
                          className="save-button"
                        >
                          <span className="button-icon">✓</span>
                        </button>
                        <button 
                          onClick={() => setEditingCommentId(null)}
                          className="cancel-button"
                        >
                          <span className="button-icon">✕</span>
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => startEdit(comment)}
                        className="edit-button"
                      >
                        <span className="button-icon">✎</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

CommentList.propTypes = {
  comments: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default CommentList;