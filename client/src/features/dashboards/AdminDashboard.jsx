import React, { useEffect, useState } from 'react';
import apiClient from '../../shared/apiClient';
import { useAuth } from '../auth/AuthContext';
import { Users, TrendingUp, AlertCircle } from 'lucide-react';
import DataTable from '../../shared/components/DataTable';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Fetch global order stats
        const res = await apiClient.get('/reports/orders');
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching admin data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><TrendingUp /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Global Revenue (30d)</p>
            <h3 className="text-2xl font-bold text-slate-800">₹1,24,500</h3>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><Users /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Active Partners</p>
            <h3 className="text-2xl font-bold text-slate-800">42</h3>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg"><AlertCircle /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Open Support Tickets</p>
            <h3 className="text-2xl font-bold text-slate-800">5</h3>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Platform Order Status Overview</h2>
        <DataTable 
          columns={[
            { header: 'Status', accessor: '_id' },
            { header: 'Order Count', accessor: 'count' },
            { header: 'Total Value', render: (row) => `₹${row.totalValue || 0}` }
          ]} 
          data={stats || []} 
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
