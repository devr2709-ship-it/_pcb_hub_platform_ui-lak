import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import GerberUploadModal from './components/GerberUploadModal';
import CheckoutModal from './components/CheckoutModal';
import HomePage from './pages/HomePage';
import ProductSelectionPage from './pages/ProductSelectionPage';
import CustomPcbConfiguratorPage from './pages/CustomPcbConfiguratorPage';
import InstantPriceCalculatorPage from './pages/InstantPriceCalculatorPage';
import HowItWorksPage from './pages/HowItWorksPage';
import DesignHelpPage from './pages/DesignHelpPage';
import TrackOrderPage from './pages/TrackOrderPage';
import { useConfig } from './context/ConfigContext';

// Scroll to top upon route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { toastMessage } = useConfig();

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <ScrollToTop />
      {/* Global Fixed Navigation */}
      <Navbar />

      {/* Main Page Canvas with top offset for fixed header */}
      <main className="grow w-full pt-[96px] bg-surface min-h-[calc(100vh-96px)]">
        <Routes>
          <Route path="/" element={<HomePage onOpenUploadModal={() => setIsUploadModalOpen(true)} />} />
          <Route path="/product-selection" element={<ProductSelectionPage />} />
          <Route path="/custom-pcb" element={<CustomPcbConfiguratorPage onOpenUploadModal={() => setIsUploadModalOpen(true)} />} />
          <Route path="/pricing" element={<InstantPriceCalculatorPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/design-help" element={<DesignHelpPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="*" element={<HomePage onOpenUploadModal={() => setIsUploadModalOpen(true)} />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Cart Side Drawer */}
      <CartDrawer />

      {/* Checkout Flow Modal */}
      <CheckoutModal />

      {/* Gerber Upload DFM Analysis Modal */}
      <GerberUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-surface-variant/30 animate-bounce">
          <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
          <span className="font-mono text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;
