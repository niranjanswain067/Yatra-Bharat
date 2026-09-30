import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import EnquiryForm from '../components/EnquiryForm';

const PlanDetail = () => {
  const { slug } = useParams();
  const [showEnquiry, setShowEnquiry] = useState(false);

  const { data: plan, isLoading, isError } = useQuery({
    queryKey: ['public-plan', slug],
    queryFn: async () => {
      const res = await api.get(`/plans/${slug}`);
      return res.data.data;
    }
  });

  if (isLoading) return <div className="section-container" style={{ textAlign: 'center' }}>Loading...</div>;
  if (isError || !plan) return <div className="section-container" style={{ textAlign: 'center' }}>Travel Plan not found.</div>;

  return (
    <div>
      <section 
        className="hero" 
        style={{ 
          height: '60vh', 
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1920&auto=format&fit=crop')` 
        }}
      >
        <h1 style={{ fontSize: '3.5rem' }}>{plan.name}</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>{plan.durationDays} Days • {plan.priceCurrency} {plan.priceAmount}</p>
        <button className="btn-cta" style={{ marginTop: '2rem' }} onClick={() => setShowEnquiry(true)}>
          Enquire Now
        </button>
      </section>

      <div className="section-container" style={{ maxWidth: '900px' }}>
        
        <h2>Destinations Covered</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {plan.destinations.map(pd => (
            <Link 
              key={pd.destinationId} 
              to={`/destinations/${pd.destination.slug}`}
              style={{ padding: '0.8rem 1.5rem', backgroundColor: 'var(--light)', color: 'var(--dark)', textDecoration: 'none', borderRadius: '30px', fontWeight: 600, border: '1px solid #ddd' }}
            >
              {pd.destination.name}
            </Link>
          ))}
        </div>

        <h2>Itinerary Overview</h2>
        {plan.days?.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
            {plan.days.sort((a, b) => a.dayNumber - b.dayNumber).map(day => (
              <div key={day.id} style={{ background: 'white', padding: '2rem', borderRadius: '15px', borderLeft: '5px solid var(--primary)', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, color: 'var(--primary)' }}>Day {day.dayNumber}: {day.title}</h3>
                <p style={{ marginBottom: 0, color: '#555', lineHeight: 1.6 }}>{day.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '3rem', background: 'var(--light)', borderRadius: '15px', textAlign: 'center' }}>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>Detailed daily itinerary is coming soon.</p>
          </div>
        )}

      </div>
      
      {showEnquiry && (
        <EnquiryForm plan={plan} onClose={() => setShowEnquiry(false)} />
      )}
    </div>
  );
};

export default PlanDetail;
