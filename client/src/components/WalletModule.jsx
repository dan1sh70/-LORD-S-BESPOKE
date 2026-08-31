import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Briefcase, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const mockWallet = {
  mainBalance: 4500.00,
  growthBalance: 1200.50,
  todaysWorkBalance: 350.00,
  rewardBalance: 150.00
};

const mockTransactions = [
  { id: 'TXN-1', type: 'Credit', amount: 350.00, desc: 'Order ORD-8921 Completion', date: 'Today, 2:30 PM' },
  { id: 'TXN-2', type: 'Debit', amount: 1500.00, desc: 'Withdrawal to Bank', date: 'Yesterday, 10:15 AM' },
  { id: 'TXN-3', type: 'Credit', amount: 50.00, desc: 'Referral Bonus (Level 1)', date: 'Aug 29, 4:45 PM' },
];

const WalletCard = ({ title, amount, icon: Icon, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-panel" 
    style={{ padding: '1.5rem', flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{title}</p>
      <div style={{ padding: '0.5rem', background: `rgba(${color}, 0.1)`, borderRadius: 'var(--radius-sm)' }}>
        <Icon size={18} color={`rgb(${color})`} />
      </div>
    </div>
    <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>
      <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginRight: '0.2rem' }}>₹</span>
      {amount.toFixed(2)}
    </h3>
  </motion.div>
);

const WalletModule = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Balances Grid */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <WalletCard title="Main Balance" amount={mockWallet.mainBalance} icon={Wallet} color="99, 102, 241" />
        <WalletCard title="Growth Balance" amount={mockWallet.growthBalance} icon={TrendingUp} color="16, 185, 129" />
        <WalletCard title="Today's Work" amount={mockWallet.todaysWorkBalance} icon={Briefcase} color="245, 158, 11" />
        <WalletCard title="Reward Balance" amount={mockWallet.rewardBalance} icon={Award} color="236, 72, 153" />
      </div>

      {/* Transactions List */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Recent Transactions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mockTransactions.map((txn, i) => (
            <motion.div 
              key={txn.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  background: txn.type === 'Credit' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                  padding: '0.5rem', 
                  borderRadius: '50%' 
                }}>
                  {txn.type === 'Credit' ? <ArrowUpRight size={20} color="var(--success)" /> : <ArrowDownRight size={20} color="var(--error)" />}
                </div>
                <div>
                  <p style={{ fontWeight: 500 }}>{txn.desc}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{txn.date} • {txn.id}</p>
                </div>
              </div>
              <p style={{ 
                fontWeight: 600, 
                color: txn.type === 'Credit' ? 'var(--success)' : 'var(--text-primary)' 
              }}>
                {txn.type === 'Credit' ? '+' : '-'}₹{txn.amount.toFixed(2)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default WalletModule;
