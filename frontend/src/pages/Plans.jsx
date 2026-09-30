import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import EnquiryForm from '../components/EnquiryForm';

const Plans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const { data: plans, isLoading } = useQuery({
    queryKey: ['public-plans'],
    queryFn: async () => {
      const res = await api.get('/plans');
      return res.data.data;
    }
  });

  return (
    <div className="section-container" style={{ paddingTop: '2rem' }}>
      <h1 className="section-title">Travel Plans</h1>
      <p style={{ textAlign: 'center', marginBottom: '3rem', color: '#666', fontSize: '1.1rem' }}>
        Curated itineraries for the perfect getaway.
      </p>

      {isLoading ? (
        <p style={{ textAlign: 'center' }}>Loading travel plans...</p>
      ) : (
        <div className="grid-container">
          {plans?.map((plan) => (
            <div className="card" key={plan.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div 
                className="card-img" 
                style={{ 
                  backgroundImage: `url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop')`,
                  height: '180px'
                }}
              ></div>
              <div className="card-content" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 className="card-title">{plan.name}</h3>
                <div className="card-subtitle">{plan.durationDays} Days • {plan.priceCurrency} {plan.priceAmount}</div>
                <p className="card-text">
                  Includes visits to: {plan.destinations.map(pd => pd.destination.name).join(', ')}
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                  <button className="btn-cta" style={{ width: '100%', padding: '0.8rem' }} onClick={() => setSelectedPlan(plan)}>
                    Enquire Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPlan && (
        <EnquiryForm plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}
    </div>
  );
};

export default Plans;
