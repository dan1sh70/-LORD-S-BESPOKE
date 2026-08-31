import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TailorDashboard = () => {
  const [progress, setProgress] = useState(50); // Mock active order progress

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Tailor Workspace</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Update your current task progress.</p>
      </header>

      <div className="glass-panel" style={{ padding: '3rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Suit Alteration</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>ORD-8921 • Length, Waist</p>
        </div>

        {/* Big Circular Progress or Bar */}
        <div style={{ background: 'var(--bg-tertiary)', height: '24px', borderRadius: '12px', overflow: 'hidden', marginBottom: '3rem', border: '1px solid var(--border-color)' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
            style={{ height: '100%', background: 'var(--accent-color)' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button onClick={() => setProgress(25)} style={{ padding: '1rem', background: progress >= 25 ? 'rgba(99,102,241,0.2)' : 'var(--bg-tertiary)', border: `1px solid ${progress >= 25 ? 'var(--accent-color)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', color: 'white', cursor: 'pointer' }}>25% Done</button>
          <button onClick={() => setProgress(50)} style={{ padding: '1rem', background: progress >= 50 ? 'rgba(99,102,241,0.2)' : 'var(--bg-tertiary)', border: `1px solid ${progress >= 50 ? 'var(--accent-color)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', color: 'white', cursor: 'pointer' }}>50% Done</button>
          <button onClick={() => setProgress(75)} style={{ padding: '1rem', background: progress >= 75 ? 'rgba(99,102,241,0.2)' : 'var(--bg-tertiary)', border: `1px solid ${progress >= 75 ? 'var(--accent-color)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', color: 'white', cursor: 'pointer' }}>75% Done</button>
          <button onClick={() => setProgress(100)} style={{ padding: '1rem', background: progress >= 100 ? 'rgba(16,185,129,0.2)' : 'var(--bg-tertiary)', border: `1px solid ${progress >= 100 ? 'var(--success)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', color: 'white', cursor: 'pointer' }}>100% Complete</button>
        </div>
      </div>
    </motion.div>
  );
};

export default TailorDashboard;
