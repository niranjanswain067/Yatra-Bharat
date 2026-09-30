import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const AdminEnquiries = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-enquiries'],
    queryFn: async () => {
      const response = await api.get('/admin/enquiries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    }
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await api.put(`/admin/enquiries/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-enquiries']);
      setSelected(prev => prev ? { ...prev, status: prev._nextStatus } : null);
    }
  });

  const handleStatusChange = (id, newStatus) => {
    statusMutation.mutate({ id, status: newStatus });
    setSelected(prev => prev ? { ...prev, status: newStatus, _nextStatus: newStatus } : null);
  };

  return (
    <div className="admin-page">
      <h1>Enquiries</h1>
      
      {isLoading && <p>Loading enquiries...</p>}
      {isError && <div className="error-message">Failed to load enquiries.</div>}
      
      {!isLoading && !isError && data && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No enquiries found.</td>
              </tr>
            )}
            {data.map((enquiry) => (
              <tr key={enquiry.id}>
                <td>{enquiry.name}</td>
                <td>{enquiry.email}</td>
                <td>{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                <td>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    backgroundColor: enquiry.status === 'NEW' ? '#fff3cd' : enquiry.status === 'CONTACTED' ? '#cce5ff' : '#d4edda',
                    color: enquiry.status === 'NEW' ? '#856404' : enquiry.status === 'CONTACTED' ? '#004085' : '#155724'
                  }}>
                    {enquiry.status}
                  </span>
                </td>
                <td>
                  <button className="btn-small" onClick={() => setSelected(enquiry)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Enquiry Detail Modal */}
      {selected && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 2000
        }}>
          <div style={{
            background: 'white', borderRadius: '15px', padding: '2.5rem',
            width: '90%', maxWidth: '550px', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }}>
            <button 
              onClick={() => setSelected(null)} 
              style={{ position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              &times;
            </button>

            <h2 style={{ marginTop: 0 }}>Enquiry Details</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              <div>
                <strong>Name</strong>
                <p style={{ margin: '0.25rem 0 0' }}>{selected.name}</p>
              </div>
              <div>
                <strong>Email</strong>
                <p style={{ margin: '0.25rem 0 0' }}>{selected.email}</p>
              </div>
              <div>
                <strong>Phone</strong>
                <p style={{ margin: '0.25rem 0 0' }}>{selected.phone || 'Not provided'}</p>
              </div>
              <div>
                <strong>Message</strong>
                <p style={{ margin: '0.25rem 0 0', lineHeight: 1.6 }}>{selected.message || 'No message'}</p>
              </div>
              <div>
                <strong>Date</strong>
                <p style={{ margin: '0.25rem 0 0' }}>{new Date(selected.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <strong>Status</strong>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {['NEW', 'CONTACTED', 'CLOSED'].map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selected.id, s)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: selected.status === s ? '2px solid var(--primary, #ff5a5f)' : '1px solid #ddd',
                        backgroundColor: selected.status === s ? '#fff0f0' : 'white',
                        fontWeight: selected.status === s ? 700 : 400,
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="btn-primary"
              style={{ marginTop: '2rem', width: '100%' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;
