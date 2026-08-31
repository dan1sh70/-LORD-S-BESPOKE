import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User } from 'lucide-react';

const Login = () => {
  const [mobile, setMobile] = useState('9876543210');
  const [password, setPassword] = useState('password123');
  const [roleDemo, setRoleDemo] = useState('Super Admin');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // MOCK LOGIN FOR UI DEMONSTRATION
    // In production, this would be an axios.post to /api/auth/login
    const mockUser = {
      _id: '123',
      name: 'Demo User',
      mobile,
      role: roleDemo,
      token: 'fake-jwt-token'
    };
    
    login(mockUser);
    
    // Route based on role
    if (roleDemo === 'Super Admin') navigate('/admin');
    else if (roleDemo === 'Shop') navigate('/shop');
    else if (roleDemo === 'Master') navigate('/master');
    else if (roleDemo === 'Tailor') navigate('/tailor');
    else if (roleDemo === 'Delivery Boy') navigate('/delivery');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
        style={{ padding: '3rem', maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}
      >
        <div style={{ textAlign: 'center' }}>
          <ShieldCheck size={48} color="var(--accent-color)" style={{ marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>LORD'S ERP</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Mobile Number</label>
            <input 
              type="text" 
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'white', outline: 'none' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'white', outline: 'none' }} 
            />
          </div>
          
          <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--accent-color)', fontWeight: 600 }}>Demo: Select Role to Login As</label>
            <select 
              value={roleDemo} 
              onChange={(e) => setRoleDemo(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-tertiary)', color: 'white', border: 'none', outline: 'none', borderRadius: 'var(--radius-sm)' }}
            >
              <option>Super Admin</option>
              <option>Shop</option>
              <option>Master</option>
              <option>Tailor</option>
              <option>Delivery Boy</option>
            </select>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            style={{ background: 'var(--accent-color)', color: 'white', border: 'none', padding: '1rem', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', boxShadow: 'var(--shadow-glow)' }}
          >
            <User size={18} /> Sign In
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
