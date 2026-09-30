import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const AdminTravelPlans = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data: plans, isLoading, isError } = useQuery({
    queryKey: ['admin-plans'],
    queryFn: async () => {
      const response = await api.get('/admin/plans', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/plans/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-plans']);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this travel plan?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header-actions">
        <h1>Travel Plans</h1>
        <Link to="/admin/plans/new" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto' }}>+ Add New</Link>
      </div>
      
      {isLoading && <p>Loading travel plans...</p>}
      {isError && <div className="error-message">Failed to load travel plans.</div>}
      
      {!isLoading && !isError && plans && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No travel plans found.</td>
              </tr>
            )}
            {plans.map((plan) => (
              <tr key={plan.id}>
                <td>{plan.name}</td>
                <td>{plan.durationDays} Days</td>
                <td>{plan.priceAmount} {plan.priceCurrency}</td>
                <td>{plan.status}</td>
                <td>
                  <Link to={`/admin/plans/${plan.id}/edit`} className="btn-small" style={{ marginRight: '8px', textDecoration: 'none' }}>Edit</Link>
                  <button className="btn-small" style={{ backgroundColor: '#dc3545' }} onClick={() => handleDelete(plan.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminTravelPlans;
