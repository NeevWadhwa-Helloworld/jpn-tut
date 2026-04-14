import React, { useState, useEffect } from 'react';
import { Auth } from '../utils/auth';

const Navbar = ({ currentView, navigate, settings, updateSettings, loggedIn, user, setLoggedIn, setUser }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('nn_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nn_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleAudio = () => {
    updateSettings({ ...settings, audioEnabled: !settings.audioEnabled });
  };
  const toggleFurigana = () => {
    updateSettings({ ...settings, showFurigana: !settings.showFurigana });
  };

  const handleLogout = () => {
    Auth.logout();
    setLoggedIn(false);
    setUser(null);
    navigate('welcome');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className="navbar" id="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo-mark">日</span>
        <span className="navbar__title">Nihongo Navi</span>
      </div>
      
      {loggedIn ? (
        <>
          <div className="navbar__links" id="navLinks">
            <button className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => navigate('dashboard')}>Dashboard</button>
            <button className={`nav-btn ${currentView === 'study' ? 'active' : ''}`} onClick={() => navigate('study')}>Flashcards</button>
            <button className={`nav-btn ${currentView === 'quiz' ? 'active' : ''}`} onClick={() => navigate('quiz')}>Quiz</button>
            <button className={`nav-btn ${currentView === 'levels' ? 'active' : ''}`} onClick={() => navigate('levels')}>Levels</button>
            <button className={`nav-btn nav-btn--ai ${currentView === 'ai' ? 'active' : ''}`} onClick={() => navigate('ai')}>✦ Sensei AI</button>
          </div>
          <div className="navbar__right">
            <span style={{cursor:'pointer'}} className="level-badge" id="levelBadge" onClick={() => navigate('levels')}>{settings.level}</span>
            <button className="icon-btn" title="Toggle theme" onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button className={`icon-btn ${settings.audioEnabled ? 'active' : ''}`} id="audioToggle" title="Toggle audio" onClick={toggleAudio}>🔊</button>
            <button className={`icon-btn ${settings.showFurigana ? 'active' : ''}`} id="furiganaToggle" title="Toggle furigana" onClick={toggleFurigana}>あ</button>
            
            <div className="nav-profile-wrapper" onMouseLeave={() => setDropdownOpen(false)}>
              <div className="profile-circle" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {getInitials(user?.name)}
              </div>
              <div className={`profile-dropdown ${dropdownOpen ? 'open' : ''}`}>
                <span className="profile-name-label">{user?.name}</span>
                <button className="profile-dropdown-item" onClick={() => { setDropdownOpen(false); navigate('profile'); }}>Edit Profile</button>
                <button className="profile-dropdown-item logout" onClick={handleLogout}>Log Out</button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="navbar__right" style={{ marginLeft: 'auto' }}>
          <button className="icon-btn" style={{ marginRight: '8px' }} title="Toggle theme" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="nav-btn" onClick={() => navigate('welcome')}>Sign In</button>
          <button className="primary-btn" style={{ padding: '8px 16px', marginLeft: '8px' }} onClick={() => navigate('signup')}>Sign Up</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
