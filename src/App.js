import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import CommentsPage from './pages/CommentsPage';
import PostsPage from './pages/PostsPage';
import AlbumsPage from './pages/AlbumsPage';
import TodosPage from './pages/TodosPage';
import UsersPage from './pages/UsersPage';
import CaseOpening from './CaseOpening';

function App() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  const contentStyle = {
    marginLeft: isNavCollapsed ? '60px' : '250px',
    padding: '20px',
    transition: 'margin-left 0.3s ease',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa'
  };

  return (
    <Router>
      <Navigation 
        isCollapsed={isNavCollapsed}
        toggleNav={() => setIsNavCollapsed(!isNavCollapsed)} 
      />
      
      <div style={contentStyle}>
        <Routes>
          <Route path="/" element={<CommentsPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/albums" element={<AlbumsPage />} />
          <Route path="/todos" element={<TodosPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/case" element={<CaseOpening />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;