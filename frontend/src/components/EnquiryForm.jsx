import React, { useState } from 'react';
import api from '../lib/api';

const EnquiryForm = ({ plan, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: plan ? `I am interested in the ${plan.name} plan.` : ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.post('/enquiries', formData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError('Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 2000
    }}>
      <div className="public-form-container" style={{ width: '90%', maxWidth: '500px', position: 'relative' }}>
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          &times;
        </button>
        
        <h2 style={{ marginBottom: '1.5rem', marginTop: 0 }}>Enquire Now</h2>
        
        {plan && <p style={{ color: 'var(--secondary)', fontWeight: 600, marginBottom: '1rem' }}>Regarding: {plan.name}</p>}
        
        {success ? (
          <div style={{ padding: '1.5rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '8px', textAlign: 'center' }}>
            Thank you! Your enquiry has been submitted. We will contact you shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
            
            <div className="public-form-group">
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="public-form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            
            <div className="public-form-group">
              <label>Phone Number (Optional)</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            
            <div className="public-form-group">
              <label>Message</label>
              <textarea name="message" rows="4" value={formData.message} onChange={handleChange}></textarea>
            </div>
            
            <button type="submit" className="btn-cta" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Submitting...' : 'Send Enquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EnquiryForm;
