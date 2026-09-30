import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { token } = useAuth();

  const fetchStats = async () => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const [destRes, planRes, enqRes] = await Promise.all([
      api.get('/admin/destinations', config),
      api.get('/admin/plans', config),
      api.get('/admin/enquiries', config)
    ]);
    
    // Count 'NEW' enquiries specifically, or total. We'll show total and new.
    const enquiries = enqRes.data.data;
    const newEnquiries = enquiries.filter(e => e.status === 'NEW').length;

    return {
      destinations: destRes.data.data.length,
      plans: planRes.data.data.length,
      totalEnquiries: enquiries.length,
      newEnquiries: newEnquiries
    };
  };

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchStats
  });

  return (
    <div className="admin-page">
      <h1>Dashboard</h1>
      <p>Welcome to the Yatra Bharat Admin Panel.</p>
      
      {isLoading ? (
        <p>Loading stats...</p>
      ) : isError ? (
        <div className="error-message">Failed to load dashboard statistics.</div>
      ) : (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Destinations</h3>
            <p className="stat-number">{stats?.destinations || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Travel Plans</h3>
            <p className="stat-number">{stats?.plans || 0}</p>
          </div>
          <div className="stat-card">
            <h3>New Enquiries</h3>
            <p className="stat-number">{stats?.newEnquiries || 0}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
