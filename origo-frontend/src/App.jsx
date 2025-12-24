import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import LandingPage from './pages/LandingPage';

import { AuthProvider } from './context/AuthContext';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import ChatPage from './pages/ChatPage';
import MessagesPage from './pages/MessagesPage';
import ShippingPage from './pages/ShippingPage';
import CommunitiesPage from './pages/CommunitiesPage';
import EventsPage from './pages/EventsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import PremiumPage from './pages/PremiumPage';
import CommunityDetailsPage from './pages/CommunityDetailsPage';
import EventDetailsPage from './pages/EventDetailsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-bg-primary text-text-primary">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/chat/:userId" element={<ChatPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/ship" element={<ShippingPage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/communities/:id" element={<CommunityDetailsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/premium" element={<PremiumPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
