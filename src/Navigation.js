import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ isCollapsed, toggleNav }) => {
  return (
    <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggle-btn" onClick={toggleNav}>
        {isCollapsed ? '→' : '←'}
      </button>
      
      <ul>
        {[
          { to: "/", text: "Комментарии" },
          { to: "/posts", text: "Посты" },
          { to: "/albums", text: "Альбомы" },
          { to: "/todos", text: "Задачи" },
          { to: "/users", text: "Пользователи" },
          { to: "/case" ,text: "ladno, depay" }
        ].map((item) => (
          <li key={item.to}>
            <NavLink 
              to={item.to} 
              end 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.text}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;