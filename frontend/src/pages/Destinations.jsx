import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Link } from 'react-router-dom';

const Destinations = () => {
  const { data: destinations, isLoading } = useQuery({
    queryKey: ['public-destinations'],
    queryFn: async () => {
      const res = await api.get('/destinations');
      return res.data.data;
    }
  });

  return (
    <div className="section-container" style={{ paddingTop: '2rem' }}>
      <h1 className="section-title">All Destinations</h1>
      <p style={{ textAlign: 'center', marginBottom: '3rem', color: '#666', fontSize: '1.1rem' }}>
        Explore our handpicked locations across India.
      </p>

      {isLoading ? (
        <p style={{ textAlign: 'center' }}>Loading destinations...</p>
      ) : (
        <div className="grid-container">
          {destinations?.map((dest) => (
            <div className="card" key={dest.id}>
              <div 
                className="card-img" 
                style={{ 
                  backgroundImage: `url(${getDestImage(dest.slug)})` 
                }}
              ></div>
              <div className="card-content">
                <h3 className="card-title">{dest.name}</h3>
                <div className="card-subtitle">{dest.region} • Best in: {dest.bestSeason || 'Anytime'}</div>
                <p className="card-text">{dest.summary}</p>
              </div>
            </div>
          ))}
        </div>
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

export default Destinations;
