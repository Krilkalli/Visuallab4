import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './style.css';
const DataSet = ({
  data = [],
  headers,
  renderHeader,
  renderCell,
  rowKey = 'id',
  className = '',
}) => {
  // Состояние для хранения выделенных строк
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Обработчик клика по строке
  const handleRowClick = (event, rowId) => {
    // Проверяем, зажата ли клавиша Ctrl
    const isCtrlPressed = event.ctrlKey || event.metaKey;

    setSelectedRows(prevSelected => {
      const newSelected = isCtrlPressed ? new Set(prevSelected) : new Set();
      
      // Если строка уже выделена и нажат Ctrl - снимаем выделение
      // Иначе добавляем в выделенные
      if (prevSelected.has(rowId) && isCtrlPressed) {
        newSelected.delete(rowId);
      } else {
        newSelected.add(rowId);
      }
      
      return newSelected;
    });
  };

  // Определяем заголовки, если они не переданы
  const resolvedHeaders = headers || 
    (data.length > 0 ? Object.keys(data[0]) : []);

  // Область для выделения строки (левая часть)
  const renderSelectionArea = (rowId) => (
    <div 
      className="selection-area"
      onClick={(e) => handleRowClick(e, rowId)}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {selectedRows.has(rowId) ? '✓' : ' '}
    </div>
  );

  return (
    <div className={`data-set ${className}`}>
      <table>
        <thead>
          <tr>
            <th className="selection-header"></th>
            {resolvedHeaders.map((header, index) => (
              <th key={index}>
                {renderHeader 
                  ? renderHeader(header, index) 
                  : (typeof header === 'object' ? header.title : header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const rowId = row[rowKey] || rowIndex;
            const isSelected = selectedRows.has(rowId);
            
            return (
              <tr 
                key={rowId}
                className={isSelected ? 'selected' : ''}
              >
                <td className="selection-cell">
                  {renderSelectionArea(rowId)}
                </td>
                {resolvedHeaders.map((header, colIndex) => {
                  const field = typeof header === 'object' ? header.field : header;
                  const cellValue = row[field];
                  
                  return (
                    <td key={colIndex}>
                      {renderCell 
                        ? renderCell(cellValue, row, rowIndex, colIndex)
                        : String(cellValue)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

DataSet.propTypes = {
  // Массив данных для отображения
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  
  // Массив заголовков (может быть строкой или объектом {field: 'name', title: 'Имя'})
  headers: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        field: PropTypes.string.isRequired,
        title: PropTypes.string,
      }),
    ])
  ),
  
  // Функция для рендеринга заголовка
  renderHeader: PropTypes.func,
  
  // Функция для рендеринга ячейки
  renderCell: PropTypes.func,
  
  // Имя свойства, которое используется как ключ строки
  rowKey: PropTypes.string,
  
  // Дополнительные классы CSS
  className: PropTypes.string,
};

export default DataSet;