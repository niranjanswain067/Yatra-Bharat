import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const AdminDestinationForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    summary: '',
    description: '',
    bestSeason: '',
    status: 'DRAFT'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchDestination = async () => {
        try {
          const res = await api.get('/admin/destinations', {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Since we don't have a single GET by ID yet, we filter from all
          const dest = res.data.data.find(d => d.id === id);
          if (dest) {
            setFormData({
              name: dest.name,
              slug: dest.slug,
              summary: dest.summary,
              description: dest.description,
              bestSeason: dest.bestSeason || '',
              status: dest.status
            });
          }
        } catch (err) {
          setError('Failed to load destination details');
        }
      };
      fetchDestination();
    }
  }, [id, isEdit, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await api.put(`/admin/destinations/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post('/admin/destinations', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate('/admin/destinations');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <h1>{isEdit ? 'Edit Destination' : 'Add New Destination'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label>Slug (URL friendly)</label>
          <input type="text" name="slug" value={formData.slug} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label>Summary</label>
          <input type="text" name="summary" value={formData.summary} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" rows="5" value={formData.description} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label>Best Season (Optional)</label>
          <input type="text" name="bestSeason" value={formData.bestSeason} onChange={handleChange} />
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
            {loading ? 'Saving...' : 'Save Destination'}
          </button>
          <button type="button" className="btn-small" style={{ backgroundColor: '#6c757d' }} onClick={() => navigate('/admin/destinations')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminDestinationForm;
