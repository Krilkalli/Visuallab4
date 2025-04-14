import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import './DataTable.css';

const DataTable = ({ 
  data, 
  columns, 
  onAdd, 
  onDelete, 
  onUpdate, 
  validationSchema,
  initialValues,
  formFields
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleDelete = () => {
    if (selectedItems.length > 0 && window.confirm(`Удалить ${selectedItems.length} элементов?`)) {
      onDelete(selectedItems);
      setSelectedItems([]);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditFormData(item);
  };

  const saveChanges = (values) => {
    onUpdate(editingId, values);
    setEditingId(null);
  };

  return (
    <div className="data-table-container">
      <div className="add-form-section">
        <h3>Добавить новый элемент</h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            onAdd(values);
            resetForm();
          }}
        >
          {({ errors, touched }) => (
            <Form className="form">
              {formFields.map((field) => (
                <div key={field.name} className="form-group">
                  <label htmlFor={field.name}>{field.label}</label>
                  <Field
                    name={field.name}
                    type={field.type || 'text'}
                    className={`form-input ${errors[field.name] && touched[field.name] ? 'error' : ''}`}
                  />
                  <ErrorMessage name={field.name} component="div" className="error-message" />
                </div>
              ))}
              <button type="submit" className="add-button">Добавить</button>
            </Form>
          )}
        </Formik>
      </div>

      <div className="actions-container">
        <h3>Список элементов ({data.length})</h3>
        <button
          onClick={handleDelete}
          disabled={selectedItems.length === 0}
          className={`delete-button ${selectedItems.length ? '' : 'disabled'}`}
        >
          Удалить выбранные ({selectedItems.length})
        </button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Выбрать</th>
              {columns.map((column) => (
                <th key={column.key}>{column.title}</th>
              ))}
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className={selectedItems.includes(item.id) ? 'selected-row' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems([...selectedItems, item.id]);
                      } else {
                        setSelectedItems(selectedItems.filter(id => id !== item.id));
                      }
                    }}
                  />
                </td>
                
                {columns.map((column) => (
                  <td key={column.key}>
                    {editingId === item.id ? (
                      <input
                        value={editFormData[column.key]}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          [column.key]: e.target.value
                        })}
                        className="edit-input"
                      />
                    ) : (
                      item[column.key]
                    )}
                  </td>
                ))}
                
                <td className="actions-cell">
                  {editingId === item.id ? (
                    <>
                      <button onClick={() => saveChanges(editFormData)} className="save-button">
                        Сохранить
                      </button>
                      <button onClick={() => setEditingId(null)} className="cancel-button">
                        Отмена
                      </button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(item)} className="edit-button">
                      Редактировать
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  validationSchema: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  formFields: PropTypes.array.isRequired
};

export default DataTable;