const AUTH_KEY = 'nn_auth_users';
const SESSION_KEY = 'nn_auth_session';

export const Auth = {
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY) || '{}');
    } catch {
      return {};
    }
  },

  getCurrentUser() {
    try {
      const email = localStorage.getItem(SESSION_KEY);
      if (!email) return null;
      return this.getUsers()[email] || null;
    } catch {
      return null;
    }
  },

  register(name, email, password) {
    const users = this.getUsers();
    if (users[email]) {
      throw new Error("Account with this email already exists.");
    }
    users[email] = { name, email, password, phone: '' };
    localStorage.setItem(AUTH_KEY, JSON.stringify(users));
    
    // Auto login
    localStorage.setItem(SESSION_KEY, email);
    return users[email];
  },

  login(email, password) {
    const users = this.getUsers();
    const user = users[email];
    if (!user) {
      throw new Error("Account not found.");
    }
    if (user.password !== password) {
      throw new Error("Incorrect password.");
    }
    
    localStorage.setItem(SESSION_KEY, email);
    return user;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  updateUser(oldEmail, newDetails) {
    const users = this.getUsers();
    if (!users[oldEmail]) throw new Error("User not found.");

    // If changing email, check if new email exists
    if (newDetails.email !== oldEmail && users[newDetails.email]) {
      throw new Error("Phone/Email is already in use.");
    }

    const updatedUser = { ...users[oldEmail], ...newDetails };
    
    // Switch key if email changed
    if (newDetails.email !== oldEmail) {
      delete users[oldEmail];
    }
    
    users[newDetails.email] = updatedUser;
    localStorage.setItem(AUTH_KEY, JSON.stringify(users));
    
    // Update active session
    localStorage.setItem(SESSION_KEY, newDetails.email);
    
    return updatedUser;
  }
};
