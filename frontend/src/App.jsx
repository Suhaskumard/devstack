import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GithubInputPage from './pages/GithubInputPage';
import DashboardPage from './pages/DashboardPage';
import AiInsightsPage from './pages/AiInsightsPage';
import PortfolioPage from './pages/PortfolioPage';
import AboutPage from './pages/AboutPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20 px-4 md:px-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/input" element={<GithubInputPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/insights" element={<AiInsightsPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
