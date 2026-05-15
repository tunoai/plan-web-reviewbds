import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Lightbulb, Calendar, FolderOpen, Archive, Search, Bell, Calendar as CalendarIcon, Plus } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import TaskBoard from './pages/TaskBoard';
import IdeaVault from './pages/IdeaVault';
import './App.css';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Tổng quan', icon: LayoutDashboard },
    { path: '/tasks', label: 'Bảng công việc', icon: CheckSquare },
    { path: '/ideas', label: 'Kho ý tưởng', icon: Lightbulb },
    { path: '/calendar', label: 'Lịch nội dung', icon: Calendar },
    { path: '/resources', label: 'Tài nguyên', icon: FolderOpen },
    { path: '/archive', label: 'Lưu trữ', icon: Archive },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <div className="logo-icon">
          <div className="logo-shape"></div>
        </div>
        <h1 className="logo-text">AIReviewBDS</h1>
      </div>
      
      <nav className="nav-menu">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon size={20} className="nav-icon" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <button className="btn-primary w-full">
          <Plus size={18} />
          <span>Thêm nhanh</span>
        </button>
      </div>
    </aside>
  );
};

const Topbar = () => {
  return (
    <header className="topbar glass-effect">
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Tìm kiếm..." className="search-input" />
        <div className="search-shortcut">⌘ K</div>
      </div>
      
      <div className="topbar-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        <button className="icon-btn">
          <CalendarIcon size={20} />
        </button>
        <div className="profile-avatar">
          <img src="https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff" alt="Profile" />
        </div>
      </div>
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Topbar />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<TaskBoard />} />
              <Route path="/ideas" element={<IdeaVault />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
