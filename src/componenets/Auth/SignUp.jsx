import React, { useState } from 'react';
import { Auth } from '../../utils/auth';

const SignUp = ({ setLoggedIn, setUser, navigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    try {
      const user = Auth.register(name, email, password);
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
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Start mastering Japanese with Nihongo Navi.</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              className="auth-input" 
              placeholder="John Doe" 
              value={name}
              onChange={e => setName(e.target.value)}
              required 
            />
          </div>
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
          <button type="submit" className="auth-btn">Sign Up</button>
        </form>
        
        <div className="auth-link">
          Already have an account? <span onClick={() => navigate('welcome')}>Sign in</span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
