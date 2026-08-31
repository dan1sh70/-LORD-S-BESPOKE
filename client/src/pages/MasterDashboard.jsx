import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, CheckCircle } from 'lucide-react';

const mockWorkshopOrders = [
  { id: 'ORD-8922', garment: 'Dress', status: 'Master Received', assignedTo: null },
  { id: 'ORD-8921', garment: 'Suit', status: 'Work Completed', assignedTo: 'Tailor Ramesh' }
];

const MasterDashboard = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Workshop Master</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Assign tasks and manage quality control.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {mockWorkshopOrders.map((order, i) => (
          <motion.div key={order.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{order.id}</span>
                <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem' }}>{order.garment}</span>
              </div>
              <h3 style={{ marginTop: '0.5rem', color: order.status === 'Work Completed' ? 'var(--success)' : 'var(--text-primary)' }}>{order.status}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {order.assignedTo ? `Assigned to: ${order.assignedTo}` : 'Unassigned'}
              </p>
            </div>
            
            <div>
              {order.status === 'Master Received' && (
                <button style={{ background: 'var(--accent-color)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Scissors size={16} /> Assign Tailor
                </button>
              )}
              {order.status === 'Work Completed' && (
                <button style={{ background: 'var(--success)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} /> Perform QC
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MasterDashboard;
