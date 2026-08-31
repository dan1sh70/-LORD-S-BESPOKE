import React, { useEffect, useState } from 'react';
import apiClient from '../../shared/apiClient';
import ProgressBar from '../../shared/components/ProgressBar';

const TailorDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiClient.get('/orders');
        // Isolate to tailor specific states
        const active = res.data.filter(o => o.status === 'TAILOR_ASSIGNED' || o.status === 'WORK_IN_PROGRESS');
        setOrders(active);
      } catch (error) {
        console.error("Error fetching tailor data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">My Work Queue</h2>
      
      {orders.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">No active garments assigned.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map(order => (
            <div key={order._id} className="card p-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{order.garmentType}</h3>
                    <p className="text-sm text-slate-500">Task: {order.alterationDetails}</p>
                  </div>
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-bold">
                    {order.priority}
                  </span>
                </div>
                <div className="mt-4">
                  <ProgressBar progress={order.progressPercent || 0} />
                </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[150px]">
                <button className="btn-secondary text-sm">Update Progress</button>
                <button className="btn-primary text-sm bg-emerald-600 hover:bg-emerald-700">Mark Ready for QC</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TailorDashboard;
