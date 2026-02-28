// ==========================================
// API CLIENT IMPLEMENTATION (Replaces Mock Firebase)
// Connects to Node.js + MongoDB Backend
// ==========================================

const apiBase = 'http://localhost:5000/api';

class AuthClient {
  constructor() {
    this.currentUser = null;
    this.listeners = [];
    this.token = localStorage.getItem('auth_token');

    // Attempt to restore session on load
    if (this.token) {
      this.fetchUser();
    }
  }

  async fetchUser() {
    try {
      const res = await fetch(`${apiBase}/me`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: this.token })
      });
      const data = await res.json();
      if (data.user) {
        this.currentUser = data.user;
        this.notify();
      } else {
        this.logoutLocal();
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      this.logoutLocal();
    }
  }

  logoutLocal() {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem('auth_token');
    this.notify();
  }

  onAuthStateChanged(cb) {
    this.listeners.push(cb);
    cb(this.currentUser); // Always fire with current state (null or user)
    return () => { this.listeners = this.listeners.filter(l => l !== cb); };
  }

  notify() {
    this.listeners.forEach(cb => cb(this.currentUser));
  }

  async signInAdmin(email, password) {
    const res = await fetch(`${apiBase}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    this.token = data.token;
    this.currentUser = data.user;
    localStorage.setItem('auth_token', data.token);
    this.notify();
    return { user: data.user };
  }

  async signInNursery(email, password) {
    const res = await fetch(`${apiBase}/nursery/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    this.token = data.token;
    this.currentUser = data.user;
    localStorage.setItem('auth_token', data.token);
    this.notify();
    return { user: data.user };
  }

  async registerNursery(nurseryData) {
    const res = await fetch(`${apiBase}/nursery/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nurseryData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Signup failed');

    this.token = data.token;
    this.currentUser = data.user;
    localStorage.setItem('auth_token', data.token);
    this.notify();
    return { user: data.user };
  }

  async signInWithEmailAndPassword(email, password) {
    const res = await fetch(`${apiBase}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    this.token = data.token;
    this.currentUser = data.user;
    localStorage.setItem('auth_token', data.token);
    this.notify();
    return { user: data.user };
  }

  async createUserWithEmailAndPassword(email, password, fullName, phoneNumber) {
    const res = await fetch(`${apiBase}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName, phoneNumber })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Signup failed');

    this.token = data.token;
    this.currentUser = data.user;
    localStorage.setItem('auth_token', data.token);
    this.notify();
    return { user: data.user };
  }

  async signOut() {
    this.logoutLocal();
  }

  // OTP Password Reset
  async requestPasswordReset(email) {
    const res = await fetch(`${apiBase}/request-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  }

  async confirmPasswordReset(email, otp, newPassword) {
    const res = await fetch(`${apiBase}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Reset failed');
    return data;
  }


}

const authInstance = new AuthClient();

// Export object structure matching Firebase SDK
const fire = {
  auth: () => authInstance
};

export { fire };
