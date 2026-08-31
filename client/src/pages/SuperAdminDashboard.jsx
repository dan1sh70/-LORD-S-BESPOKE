import React from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, Activity, ShieldCheck, BellRing, Settings } from 'lucide-react';
import WalletModule from '../components/WalletModule';

const StatCard = ({ title, value, subValue, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-panel"
    style={{ padding: '1.5rem', flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{title}</p>
      <Icon size={20} color={`rgb(${color})`} />
    </div>
    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0' }}>{value}</h2>
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '0.25rem', 
      padding: '0.25rem 0.5rem', 
      background: `rgba(${color}, 0.1)`, 
      color: `rgb(${color})`,
      borderRadius: 'var(--radius-sm)',
      width: 'fit-content',
      fontSize: '0.75rem',
      fontWeight: 600
    }}>
      {subValue}
    </div>
  </motion.div>
);

const SuperAdminDashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-container"
      style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Super Admin Control</h1>
          <p style={{ color: 'var(--text-secondary)' }}>System Overview & Network Performance</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="icon-btn" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <BellRing size={20} />
          </button>
          <button className="icon-btn" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <Settings size={20} />
          </button>
          <button style={{ background: 'var(--accent-color)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', boxShadow: 'var(--shadow-glow)' }}>
            System Settings
          </button>
        </div>
      </header>

      {/* Top Stats */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <StatCard title="Total Active Users" value="8,249" subValue="+12% this month" icon={Users} color="99, 102, 241" delay={0.1} />
        <StatCard title="Active Orders" value="1,402" subValue="89 in QC Failed" icon={ShoppingBag} color="16, 185, 129" delay={0.2} />
        <StatCard title="System Revenue (Today)" value="₹1.4M" subValue="15.2% profit margin" icon={Activity} color="245, 158, 11" delay={0.3} />
        <StatCard title="Pending Tickets" value="24" subValue="4 high priority" icon={ShieldCheck} color="239, 68, 68" delay={0.4} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Network Growth Preview (MLM) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel" 
          style={{ padding: '1.5rem' }}
        >
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Network Growth (10-Level Tree)</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { level: 1, users: 450, income: '₹45,000', percentage: 100 },
              { level: 2, users: 1200, income: '₹84,000', percentage: 70 },
              { level: 3, users: 2450, income: '₹122,500', percentage: 40 },
              { level: 4, users: 4149, income: '₹207,450', percentage: 20 },
            ].map((lvl, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '60px', fontWeight: 600, color: 'var(--text-secondary)' }}>Level {lvl.level}</div>
                <div style={{ flex: 1, background: 'var(--bg-primary)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${lvl.percentage}%` }}
                    transition={{ delay: 0.8 + (i * 0.1), duration: 0.5 }}
                    style={{ height: '100%', background: 'var(--accent-color)' }} 
                  />
                </div>
                <div style={{ width: '80px', textAlign: 'right', fontWeight: 600 }}>{lvl.income}</div>
              </div>
            ))}
            <button style={{ marginTop: '1rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
              View Full Tree
            </button>
          </div>
        </motion.div>

        {/* Global Wallet View */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
             <h3 style={{ fontSize: '1.25rem' }}>Global Financials</h3>
          </div>
          <WalletModule />
        </motion.div>
      </div>
      
    </motion.div>
  );
};

export default SuperAdminDashboard;
