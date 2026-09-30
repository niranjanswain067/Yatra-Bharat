import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import PublicLayout from './components/PublicLayout';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Plans from './pages/Plans';
import PlanDetail from './pages/PlanDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminDestinations from './pages/admin/AdminDestinations';
import AdminDestinationForm from './pages/admin/AdminDestinationForm';
import AdminTravelPlans from './pages/admin/AdminTravelPlans';
import AdminTravelPlanForm from './pages/admin/AdminTravelPlanForm';
import './styles/tokens.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/destinations/:slug" element={<DestinationDetail />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/plans/:slug" element={<PlanDetail />} />
            </Route>

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                
                <Route path="destinations" element={<AdminDestinations />} />
                <Route path="destinations/new" element={<AdminDestinationForm />} />
                <Route path="destinations/:id/edit" element={<AdminDestinationForm />} />
                
                <Route path="plans" element={<AdminTravelPlans />} />
                <Route path="plans/new" element={<AdminTravelPlanForm />} />
                <Route path="plans/:id/edit" element={<AdminTravelPlanForm />} />
                
                <Route path="enquiries" element={<AdminEnquiries />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
