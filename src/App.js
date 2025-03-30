import React from 'react';
import DataSet from './DataSet';

const App = () => {
  const users = [
    { id: 1, name: 'Korotkov Kirill', age: 25, email: 'karton1228@gmail.com' },
    { id: 2, name: 'gorbachev kirill', age: 30, email: 'sigma@gmail.com' },
    { id: 3, name: 'bob', age: 28, email: 'fari_slepyat@example.com' },
  ];

  // Вариант 1: без headers - возьмет ключи из первого объекта
  return <DataSet data={users} />;
};

export default App;