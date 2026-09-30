import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import EnquiryForm from '../components/EnquiryForm';

const DestinationDetail = () => {
  const { slug } = useParams();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const { data: destination, isLoading, isError } = useQuery({
    queryKey: ['public-destination', slug],
    queryFn: async () => {
      const res = await api.get(`/destinations/${slug}`);
      return res.data.data;
    }
  });

  if (isLoading) return <div className="section-container" style={{ textAlign: 'center' }}>Loading...</div>;
  if (isError || !destination) return <div className="section-container" style={{ textAlign: 'center' }}>Destination not found.</div>;

  return (
    <div>
      <section 
        className="hero" 
        style={{ 
          height: '60vh', 
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${getDestImage(destination.slug)})` 
        }}
      >
        <h1 style={{ fontSize: '3.5rem' }}>{destination.name}</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>{destination.region} • {destination.category?.name}</p>
      </section>

      <div className="section-container" style={{ maxWidth: '900px' }}>
        <div style={{ background: 'white', padding: '3rem', borderRadius: '15px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', marginTop: '-100px', position: 'relative', zIndex: 10 }}>
          <h2 style={{ marginTop: 0 }}>About {destination.name}</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#444' }}>
            {destination.description}
          </p>
          
          <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--light)', borderRadius: '10px' }}>
            <div>
              <strong>Best Time to Visit:</strong>
              <div style={{ color: 'var(--secondary)', marginTop: '0.5rem' }}>{destination.bestSeason || 'Year-round'}</div>
            </div>
          </div>
        </div>

        <h2 style={{ marginTop: '4rem', marginBottom: '2rem', textAlign: 'center' }}>Available Travel Plans</h2>
        
        {destination.plans?.length > 0 ? (
          <div className="grid-container">
            {destination.plans.map(p => p.travelPlan).filter(plan => plan.status === 'PUBLISHED').map((plan) => (
              <div className="card" key={plan.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card-content" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 className="card-title">{plan.name}</h3>
                  <div className="card-subtitle">{plan.durationDays} Days • {plan.priceCurrency} {plan.priceAmount}</div>
                  
                  <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <Link to={`/plans/${plan.slug}`} className="btn-cta" style={{ flex: 1, textAlign: 'center', backgroundColor: 'var(--dark)' }}>
                      View Plan
                    </Link>
                    <button className="btn-cta" style={{ flex: 1 }} onClick={() => setSelectedPlan(plan)}>
                      Enquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#666' }}>No travel plans available for this destination yet.</p>
        )}
      </div>
      
      {selectedPlan && (
        <EnquiryForm plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}
    </div>
  );
};

const getDestImage = (slug) => {
  const images = {
    'royal-rajasthan': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1000&auto=format&fit=crop',
    'kerala-backwaters': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop',
    'mystical-himalayas': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000&auto=format&fit=crop'
  };
  return images[slug] || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1000&auto=format&fit=crop';
};

export default DestinationDetail;
