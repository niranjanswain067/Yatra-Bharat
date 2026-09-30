import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

const Home = () => {
  const { data: destinations, isLoading } = useQuery({
    queryKey: ['public-destinations'],
    queryFn: async () => {
      const res = await api.get('/destinations');
      return res.data.data;
    }
  });

  return (
    <div>
      <section className="hero">
        <h1>Discover the Soul of India</h1>
        <p>Curated heritage tours, breathtaking nature escapes, and unforgettable journeys across the subcontinent.</p>
        <Link to="/plans" className="btn-cta">Explore Travel Plans</Link>
      </section>

      <section className="section-container">
        <h2 className="section-title">Featured Destinations</h2>

        {isLoading ? (
          <p style={{ textAlign: 'center' }}>Loading stunning destinations...</p>
        ) : (
          <div className="grid-container">
            {destinations?.slice(0, 3).map((dest) => (
              <div className="card" key={dest.id}>
                <div
                  className="card-img"
                  style={{
                    backgroundImage: `url(${getDestImage(dest.slug)})`
                  }}
                ></div>
                <div className="card-content">
                  <h3 className="card-title">{dest.name}</h3>
                  <div className="card-subtitle">{dest.region} • {dest.category?.name}</div>
                  <p className="card-text">{dest.summary}</p>
                  <Link to={`/destinations/${dest.slug}`} style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                    View details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

// Helper to provide nice unsplash images based on slug
const getDestImage = (slug) => {
  const images = {
    'royal-rajasthan': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1000&auto=format&fit=crop',
    'kerala-backwaters': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop',
    'mystical-himalayas': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000&auto=format&fit=crop'
  };
  return images[slug] || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1000&auto=format&fit=crop';
};

export default Home;
