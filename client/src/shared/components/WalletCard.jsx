import React from 'react';
import { format } from 'date-fns';

const WalletCard = ({ wallet }) => {
  if (!wallet) return <div>Loading Wallet...</div>;

  return (
    <div className="space-y-6">
      {/* 4 Buckets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 border-l-4 border-primary-500">
          <p className="text-sm text-slate-500 font-medium">Main Wallet</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">₹{wallet.mainWallet}</h3>
        </div>
        <div className="card p-4 border-l-4 border-emerald-500">
          <p className="text-sm text-slate-500 font-medium">Growth Wallet</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">₹{wallet.growthWallet}</h3>
        </div>
        <div className="card p-4 border-l-4 border-amber-500">
          <p className="text-sm text-slate-500 font-medium">Today's Work</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">₹{wallet.todaysWorkWallet}</h3>
        </div>
        <div className="card p-4 border-l-4 border-purple-500">
          <p className="text-sm text-slate-500 font-medium">Reward Wallet</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">₹{wallet.rewardWallet}</h3>
        </div>
      </div>

      {/* Transaction Ledger */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-800">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Bucket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reason</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200 text-sm">
              {wallet.transactions?.slice().reverse().map((tx, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">{format(new Date(tx.timestamp), 'MMM d, yyyy HH:mm')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.type === 'CREDIT' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-700">{tx.bucket}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">₹{tx.amount}</td>
                  <td className="px-6 py-4 text-slate-500">{tx.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
