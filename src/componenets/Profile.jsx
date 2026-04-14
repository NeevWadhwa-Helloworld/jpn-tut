import React, { useState } from 'react';
import { Auth } from '../utils/auth';

const LEVELS = [
  { id: 'N5', label: 'Beginner' },
  { id: 'N4', label: 'Elementary' },
  { id: 'N3', label: 'Intermediate' },
  { id: 'N2', label: 'Upper-int.' },
  { id: 'N1', label: 'Advanced' },
];

const Profile = ({ user, setUser, settings, updateSettings, navigate }) => {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [password, setPassword] = useState(user.password || '');
  const [level, setLevel] = useState(settings.level || 'N5');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpdate = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const updatedUser = Auth.updateUser(user.email, {
        name,
        email,
        phone,
        password
      });
      setUser(updatedUser);
      updateSettings({ ...settings, level });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const initials = name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="page-container">
      <div className="study-header">
        <button className="back-btn" onClick={() => navigate('dashboard')}>← Back</button>
        <span className="deck-name">Profile Settings</span>
      </div>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-large">{initials}</div>
            <h2 className="auth-title">Edit Profile</h2>
            <p className="auth-subtitle">Manage your account details and JLPT level.</p>
          </div>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-error" style={{background: 'var(--green-light)', color: 'var(--green)'}}>Profile updated successfully!</div>}

          <form className="profile-form" onSubmit={handleUpdate}>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" className="auth-input" value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input type="email" className="auth-input" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input type="text" className="auth-input" placeholder="+1 234 567 8900" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input type="password" className="auth-input" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <div className="input-group">
              <label>JLPT Level</label>
              <select className="profile-select" value={level} onChange={e => setLevel(e.target.value)}>
                {LEVELS.map(lv => (
                  <option key={lv.id} value={lv.id}>{lv.id} — {lv.label}</option>
                ))}
              </select>
            </div>

            <div className="profile-actions">
              <button type="submit" className="primary-btn" style={{flex: 1}}>Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
