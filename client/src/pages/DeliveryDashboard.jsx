import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Navigation, CheckCircle2, MapPin, Truck } from 'lucide-react';

const mockOrders = [
  {
    id: 'ORD-8921',
    status: 'Pickup Assigned',
    type: 'Pickup',
    garmentType: 'Suit',
    shop: { name: 'Metro Tailors', address: '123 Main St, Downtown' },
    master: { name: 'Premium Workshop', address: '45 Industrial Ave' },
  },
  {
    id: 'ORD-8924',
    status: 'Ready For Delivery',
    type: 'Delivery',
    garmentType: 'Shirt',
    shop: { name: 'Style Custom', address: '78 High St, Uptown' },
    master: { name: 'Premium Workshop', address: '45 Industrial Ave' },
  }
];

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState(mockOrders);

  const handleUpdateStatus = (id, newStatus) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="page-container"
      style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}
    >
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'var(--accent-color)', padding: '0.75rem', borderRadius: 'var(--radius-lg)' }}>
          <Truck size={24} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Delivery Tasks</h1>
          <p style={{ color: 'var(--text-secondary)' }}>You have {orders.length} active assignments today.</p>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AnimatePresence>
          {orders.map((order) => (
            <motion.div 
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="glass-panel"
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 600, 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: 'var(--radius-sm)',
                      background: order.type === 'Pickup' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: order.type === 'Pickup' ? 'var(--accent-color)' : 'var(--success)',
                      textTransform: 'uppercase'
                    }}>
                      {order.type} Task
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{order.id} • {order.garmentType}</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginTop: '0.5rem' }}>{order.status}</h3>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="icon-btn" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '0.5rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--text-primary)' }}>
                    <Navigation size={18} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>From</p>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <MapPin size={16} color="var(--text-secondary)" style={{ marginTop: '0.2rem' }} />
                    <div>
                      <p style={{ fontWeight: 500 }}>{order.type === 'Pickup' ? order.shop.name : order.master.name}</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{order.type === 'Pickup' ? order.shop.address : order.master.address}</p>
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>To</p>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <Package size={16} color="var(--text-secondary)" style={{ marginTop: '0.2rem' }} />
                    <div>
                      <p style={{ fontWeight: 500 }}>{order.type === 'Pickup' ? order.master.name : order.shop.name}</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{order.type === 'Pickup' ? order.master.address : order.shop.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUpdateStatus(order.id, order.type === 'Pickup' ? 'Picked Up' : 'Delivered To Shop')}
                  style={{
                    background: 'var(--accent-color)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: 'var(--shadow-glow)'
                  }}
                >
                  <CheckCircle2 size={18} />
                  Mark as {order.type === 'Pickup' ? 'Picked Up' : 'Delivered'}
                </motion.button>
              </div>

            </motion.div>
          ))}
        </AnimatePresence>

        {orders.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p>All tasks completed for today!</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DeliveryDashboard;
