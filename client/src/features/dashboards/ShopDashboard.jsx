import React, { useEffect, useState } from 'react';
import apiClient from '../../shared/apiClient';
import DataTable from '../../shared/components/DataTable';
import WalletCard from '../../shared/components/WalletCard';
import { format } from 'date-fns';

const ShopDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const [ordersRes, walletRes] = await Promise.all([
          apiClient.get('/orders'),
          apiClient.get('/wallet/me')
        ]);
        setOrders(ordersRes.data);
        setWallet(walletRes.data);
      } catch (error) {
        console.error("Error fetching shop data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShopData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Shop Overview</h2>
        <button className="btn-primary">Create New Order</button>
      </div>

      <section>
        <h3 className="text-lg font-semibold text-slate-700 mb-4">My Finances</h3>
        <WalletCard wallet={wallet} />
      </section>

      <section className="card p-6">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Active Orders</h3>
        <DataTable 
          columns={[
            { header: 'Order No', accessor: 'orderNumber' },
            { header: 'Garment', accessor: 'garmentType' },
            { header: 'Status', render: (row) => (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {row.status.replace(/_/g, ' ')}
              </span>
            )},
            { header: 'Delivery Date', render: (row) => format(new Date(row.deliveryDate), 'MMM d, yyyy') },
            { header: 'Action', render: (row) => (
              <button className="text-primary-600 hover:text-primary-800 font-medium text-sm">View Details</button>
            )}
          ]} 
          data={orders} 
        />
      </section>
    </div>
  );
};

export default ShopDashboard;
