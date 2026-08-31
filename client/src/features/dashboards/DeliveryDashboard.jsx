import React, { useEffect, useState } from 'react';
import apiClient from '../../shared/apiClient';

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiClient.get('/orders');
        const active = res.data.filter(o => o.status === 'PICKUP_ASSIGNED' || o.status === 'PICKED_UP' || o.status === 'DELIVERY_ASSIGNED' || o.status === 'OUT_FOR_DELIVERY');
        setOrders(active);
      } catch (error) {
        console.error("Error fetching delivery data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">My Routes</h2>
      
      {orders.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">No active deliveries assigned.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map(order => (
            <div key={order._id} className="card p-6 border-l-4 border-blue-500">
              <div className="flex justify-between mb-4">
                <span className="font-bold text-slate-800">{order.orderNumber}</span>
                <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">{order.status.replace(/_/g, ' ')}</span>
              </div>
              
              <div className="space-y-3 mb-6 text-sm text-slate-600">
                <p><strong>Pickup:</strong> Shop Address (Hidden for Privacy)</p>
                <p><strong>Dropoff:</strong> Workshop Address (Hidden for Privacy)</p>
              </div>

              <button className="w-full btn-primary py-2 text-sm">Update Status</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
