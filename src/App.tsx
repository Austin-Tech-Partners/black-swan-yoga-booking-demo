import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import ClassDetailsPage from './pages/ClassDetailsPage';
import DonationPage from './pages/DonationPage';
import WaiverPage from './pages/WaiverPage';
import PaymentPage from './pages/PaymentPage';
import ConfirmationPage from './pages/ConfirmationPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bsy-light">
        <Header />
        <main className="py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/class/:id" element={<ClassDetailsPage />} />
            <Route path="/donation/:classId" element={<DonationPage />} />
            <Route path="/waiver/:classId" element={<WaiverPage />} />
            <Route path="/payment/:classId" element={<PaymentPage />} />
            <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
