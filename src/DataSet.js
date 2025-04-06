import { useState } from 'react';

export default function DataSet({ 
  data, 
  columns, 
  onAdd, 
  onUpdate, 
  selectedRows, 
  onSelect 
}) {
  const [newItem, setNewItem] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleAdd = () => {
    if (Object.values(newItem).some(val => !val)) {
      alert('Please fill all fields');
      return;
    }
    onAdd(newItem);
    setNewItem({});
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditData({ ...item });
  };

  const handleSaveEdit = () => {
    onUpdate(editData);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSelect = (id) => {
    if (selectedRows.includes(id)) {
      onSelect(selectedRows.filter(rowId => rowId !== id));
    } else {
      onSelect([...selectedRows, id]);
    }
  };

  return (
    <div className="data-set">
      <table>
        <thead>
          <tr>
            <th></th>
            {columns.map(column => (
              <th key={column.key}>{column.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Строка для добавления нового элемента */}
          <tr className="add-row">
            <td></td>
            {columns.map(column => (
              <td key={column.key}>
                {column.key !== 'id' && (
                  <input
                    type="text"
                    placeholder={column.label}
                    value={newItem[column.key] || ''}
                    onChange={(e) => 
                      setNewItem({ ...newItem, [column.key]: e.target.value })
                    }
                  />
                )}
              </td>
            ))}
            <td>
              <button onClick={handleAdd}>Add</button>
            </td>
          </tr>

          {/* Строки данных */}
          {data.map(item => (
            <tr 
              key={item.id} 
              className={selectedRows.includes(item.id) ? 'selected' : ''}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleSelect(item.id)}
                />
              </td>
              {columns.map(column => (
                <td key={column.key}>
                  {editingId === item.id && column.editable ? (
                    <input
                      type="text"
                      value={editData[column.key]}
                      onChange={(e) => 
                        setEditData({ ...editData, [column.key]: e.target.value })
                      }
                    />
                  ) : (
                    item[column.key]
                  )}
                </td>
              ))}
              <td>
                {editingId === item.id ? (
                  <>
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(item)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}