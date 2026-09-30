import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const AdminTravelPlanForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    durationDays: 1,
    priceAmount: 0,
    priceCurrency: 'INR',
    status: 'DRAFT'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchPlan = async () => {
        try {
          const res = await api.get('/admin/plans', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const plan = res.data.data.find(p => p.id === id);
          if (plan) {
            setFormData({
              name: plan.name,
              slug: plan.slug,
              durationDays: plan.durationDays,
              priceAmount: plan.priceAmount,
              priceCurrency: plan.priceCurrency,
              status: plan.status
            });
          }
        } catch (err) {
          setError('Failed to load travel plan details');
        }
      };
      fetchPlan();
    }
  }, [id, isEdit, token]);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await api.put(`/admin/plans/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post('/admin/plans', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate('/admin/plans');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <h1>{isEdit ? 'Edit Travel Plan' : 'Add New Travel Plan'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Plan Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label>Slug (URL friendly)</label>
          <input type="text" name="slug" value={formData.slug} onChange={handleChange} required />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Duration (Days)</label>
            <input type="number" name="durationDays" min="1" value={formData.durationDays} onChange={handleChange} required />
          </div>
          
          <div className="form-group" style={{ flex: 1 }}>
            <label>Price</label>
            <input type="number" name="priceAmount" min="0" value={formData.priceAmount} onChange={handleChange} required />
          </div>
          
          <div className="form-group" style={{ flex: 1 }}>
            <label>Currency</label>
            <input type="text" name="priceCurrency" value={formData.priceCurrency} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange} style={{ padding: '0.5rem', width: '100%', borderRadius: '4px', border: '1px solid #ddd' }}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: 'auto' }}>
            {loading ? 'Saving...' : 'Save Travel Plan'}
          </button>
          <button type="button" className="btn-small" style={{ backgroundColor: '#6c757d' }} onClick={() => navigate('/admin/plans')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminTravelPlanForm;
