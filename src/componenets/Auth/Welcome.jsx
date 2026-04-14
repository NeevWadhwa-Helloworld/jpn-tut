import React, { useState } from 'react';
import { Auth } from '../../utils/auth';

const Welcome = ({ setLoggedIn, setUser, navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      const user = Auth.login(email, password);
      setUser(user);
      setLoggedIn(true);
      navigate('dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">日</div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to continue your Japanese journey.</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="auth-input" 
              placeholder="sensei@example.com" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              className="auth-input" 
              placeholder="••••••••" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="auth-btn">Sign In</button>
        </form>
        
        <div className="auth-link">
          Don't have an account? <span onClick={() => navigate('signup')}>Sign up now</span>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
