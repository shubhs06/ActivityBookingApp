import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';

import ActivitiesList from './pages/user/ActivitiesList';
import ActivityDetail from './pages/user/ActivityDetail';
import MyBookings from './pages/user/MyBookings';

import AdminActivities from './pages/admin/AdminActivities';
import AdminSlots from './pages/admin/AdminSlots';
import AdminBookings from './pages/admin/AdminBookings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-paper">
          <Navbar />
          <Routes>
            {/* Public / auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />

            {/* User routes */}
            <Route path="/" element={<ProtectedRoute><ActivitiesList /></ProtectedRoute>} />
            <Route path="/activities/:id" element={<ProtectedRoute><ActivityDetail /></ProtectedRoute>} />
            <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminActivities /></ProtectedRoute>} />
            <Route path="/admin/activities/:id/slots" element={<ProtectedRoute adminOnly><AdminSlots /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute adminOnly><AdminBookings /></ProtectedRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
