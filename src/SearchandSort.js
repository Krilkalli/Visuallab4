import React from 'react';

const SearchAndSort = ({ onSearch, onSortKeyChange, onSortOrderChange }) => {
  return (
    <div style={styles.searchSortContainer}>
      <input 
        type="text" 
        placeholder="Поиск..." 
        onChange={(e) => onSearch(e.target.value)} 
        style={styles.searchBox}
      />
      <select onChange={(e) => onSortKeyChange(e.target.value)} style={styles.select}>
        <option value="title">Сортировать по названию</option>
        <option value="author">Сортировать по автору</option>
      </select>
      <select onChange={(e) => onSortOrderChange(e.target.value)} style={styles.select}>
        <option value="asc">По возрастанию</option>
        <option value="desc">По убыванию</option>
      </select>

      </div>
  );
};

const styles = {
  searchSortContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2%',
    width: '100%',
   // gap: '10px',
    alignItems: 'center',
  },
  searchBox: {
    flexDirection: 'column',
    marginRight: '10px',
    padding: '5px',
    width: '200px',
  },
  select: {
    marginRight: '10px',
    padding: '5px',
  },
};

export default SearchAndSort;
