import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, ShoppingBag, Clock } from 'lucide-react';

const mockShopOrders = [
  { id: 'ORD-8921', customer: 'John Doe', garment: 'Suit', status: 'Work In Progress 50%', date: 'Today' },
  { id: 'ORD-8922', customer: 'Sarah Smith', garment: 'Dress', status: 'Order Created', date: 'Today' },
  { id: 'ORD-8919', customer: 'Mike Johnson', garment: 'Pant', status: 'Delivered To Shop', date: 'Yesterday' }
];

const ShopDashboard = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Shop Hub</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your customer orders and tracking.</p>
        </div>
        <button style={{ background: 'var(--accent-color)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PlusCircle size={20} />
          New Order
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Active Orders List */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="var(--accent-color)" /> Active Orders
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mockShopOrders.map((order, i) => (
              <motion.div key={order.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <h4 style={{ fontSize: '1.1rem' }}>{order.customer} <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 400 }}>• {order.garment}</span></h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{order.id}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ padding: '0.25rem 0.5rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-color)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600 }}>
                    {order.status}
                  </span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{order.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions / New Order Form Stub */}
        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="var(--warning)" /> Quick Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Ready for Pickup by Customer</p>
              <h2 style={{ fontSize: '2rem', color: 'var(--success)', marginTop: '0.25rem' }}>12</h2>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Pending at Workshop</p>
              <h2 style={{ fontSize: '2rem', color: 'var(--warning)', marginTop: '0.25rem' }}>8</h2>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShopDashboard;
