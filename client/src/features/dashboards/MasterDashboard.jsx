import React, { useEffect, useState } from 'react';
import apiClient from '../../shared/apiClient';
import DataTable from '../../shared/components/DataTable';

const MasterDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiClient.get('/orders');
        // Filter orders relevant to the Master's workshop (in a real app, API would do this)
        const relevant = res.data.filter(o => o.status === 'RECEIVED_AT_WORKSHOP' || o.status === 'TAILOR_ASSIGNED' || o.status === 'QC_PENDING');
        setOrders(relevant);
      } catch (error) {
        console.error("Error fetching master data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Workshop Control Center</h2>
      
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Orders Requiring Assignment / QC</h3>
        <DataTable 
          columns={[
            { header: 'Order No', accessor: 'orderNumber' },
            { header: 'Garment', accessor: 'garmentType' },
            { header: 'Status', accessor: 'status' },
            { header: 'Action', render: (row) => {
              if (row.status === 'RECEIVED_AT_WORKSHOP') {
                return <button className="btn-primary text-xs py-1">Assign Tailor</button>;
              }
              if (row.status === 'QC_PENDING') {
                return <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-xs">Run QC</button>;
              }
              return <span className="text-slate-400 text-xs">Waiting...</span>;
            }}
          ]} 
          data={orders} 
        />
      </div>
    </div>
  );
};

export default MasterDashboard;
