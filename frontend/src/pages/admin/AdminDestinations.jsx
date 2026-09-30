import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const AdminDestinations = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data: destinations, isLoading, isError } = useQuery({
    queryKey: ['admin-destinations'],
    queryFn: async () => {
      const response = await api.get('/admin/destinations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/destinations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-destinations']);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header-actions">
        <h1>Destinations</h1>
        <Link to="/admin/destinations/new" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto' }}>+ Add New</Link>
      </div>
      
      {isLoading && <p>Loading destinations...</p>}
      {isError && <div className="error-message">Failed to load destinations.</div>}
      
      {!isLoading && !isError && destinations && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinations.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>No destinations found.</td>
              </tr>
            )}
            {destinations.map((dest) => (
              <tr key={dest.id}>
                <td>{dest.name}</td>
                <td>{dest.slug}</td>
                <td>{dest.status}</td>
                <td>
                  <Link to={`/admin/destinations/${dest.id}/edit`} className="btn-small" style={{ marginRight: '8px', textDecoration: 'none' }}>Edit</Link>
                  <button className="btn-small" style={{ backgroundColor: '#dc3545' }} onClick={() => handleDelete(dest.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDestinations;
