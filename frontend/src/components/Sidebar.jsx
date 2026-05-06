import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Library, 
  History, 
  Settings, 
  LogOut, 
  LogIn,
  User
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import './Sidebar.css';
import { useTheme } from '../context/ThemeContext';
import logoLight from '../assets/logo-Photoroom.png';
import logoDark from '../assets/logo-dark.png';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { theme } = useTheme();
  const currentLogo = theme === 'dark' ? logoDark : logoLight;

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, logout, openLoginPopup } = useUser();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MessageSquare, label: 'New Chat', path: '/chat/new' },
    { icon: History, label: 'Chat History', path: '/history' },
    { icon: Library, label: 'Vault', path: '/documents' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleAuthAction = () => {
    if (isLoggedIn) {
      logout();
      navigate('/');
    } else {
      openLoginPopup();
    }
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-logo">
            <div className="logo-icon">
              <img src={currentLogo} alt="OpsMind AI" />
            </div>
            <span className="logo-text">OpsMind AI</span>
          </div>
        )}
        <button 
          className="collapse-button"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            title={collapsed ? item.label : ''}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button 
          className="nav-item logout-button"
          onClick={handleAuthAction}
          title={collapsed ? (isLoggedIn ? 'Logout' : 'Login') : ''}
        >
          {isLoggedIn ? <LogOut size={20} /> : <LogIn size={20} />}
          {!collapsed && <span>{isLoggedIn ? 'Logout' : 'Login'}</span>}
        </button>
        
        {isLoggedIn && (
          <button
            className={`nav-item profile-button ${isActive('/profile') ? 'active' : ''}`}
            onClick={() => navigate('/profile')}
            title={collapsed ? 'Profile' : ''}
          >
            <div className="profile-avatar">
              {user.picture ? (
                <img src={user.picture} alt={user.name} />
              ) : (
                <User size={20} />
              )}
            </div>
            {!collapsed && (
              <div className="profile-info">
                <div className="profile-name">{user.name}</div>
                <div className="profile-role text-xs text-muted">{user.email}</div>
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
