import React, { createContext, useContext, useState } from 'react';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  // Currency state
  const [currency, setCurrency] = useState('INR'); // 'INR' | 'USD'
  const exchangeRate = 0.012; // 1 INR ~ 0.012 USD

  const toggleCurrency = () => {
    setCurrency(prev => (prev === 'INR' ? 'USD' : 'INR'));
  };

  const formatPrice = (amountInINR) => {
    if (currency === 'USD') {
      const usd = (amountInINR * exchangeRate).toFixed(2);
      return `$${usd}`;
    }
    return `₹${Math.round(amountInINR).toLocaleString('en-IN')}`;
  };

  // Product Selection / Demographic state
  const [selectedDemographic, setSelectedDemographic] = useState({
    gender: 'Prefer not to say',
    ageGroup: '18–24',
    purpose: 'College/University Project'
  });

  const [selectedSubstrate, setSelectedSubstrate] = useState({
    id: 'double-sided',
    name: 'Double-Sided PCB',
    tag: '2-LAYER',
    popular: true,
    startingPrice: 299,
    description: 'Most popular prototype standard, plated through-hole (PTH) vias, HASL/ENIG finish.',
    specs: {
      vias: 'Plated & Tented',
      minTrackSpace: '4 / 4 mil'
    }
  });

  // Foundry Custom Configurator state
  const [pcbConfig, setPcbConfig] = useState({
    layers: 2,
    length: 100, // mm
    width: 80,   // mm
    quantity: 5,
    unitRate: 59.8,
    solderMask: {
      id: 'blue',
      name: 'Precision Cobalt Blue',
      colorHex: '#004ac6',
      bgClass: 'bg-[#004ac6]'
    },
    surfaceFinish: {
      id: 'enig',
      name: 'ENIG Gold',
      extra: 150,
      included: true
    },
    copperWeight: '1 oz (35μm)',
    boardThickness: '1.6mm',
    castellated: false,
    edgeChamfer: false,
    turnaround: 'express', // 'standard' | 'express'
    turnaroundPrice: 199,
    uploadedFiles: [],
    dfmPassed: true
  });

  // Shopping Cart & Drawer
  const [cartItems, setCartItems] = useState([
    {
      id: 'item-1',
      title: 'Precision 2-Layer FR-4 PCB',
      dimensions: '100 × 80 mm',
      quantity: 5,
      layers: 2,
      finish: 'ENIG Gold',
      solderMask: 'Precision Cobalt Blue',
      turnaround: 'Express (24-48h)',
      price: 648
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Active Order for tracking
  const [activeOrder, setActiveOrder] = useState({
    orderId: 'PCB-84920',
    title: 'Precision 2-Layer FR-4 PCB Batch',
    quantity: 5,
    specs: '100×80mm • ENIG Gold • Cobalt Blue',
    status: 'In Fabrication',
    currentStation: 'Station 05 • LPI Coating Chamber 01',
    cleanroomTemp: '21.4°C • 48% RH',
    estimatedDispatch: 'Tomorrow 4:00 PM',
    courier: 'Bluedart Air Express'
  });

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addToCart = (customItem) => {
    const newItem = customItem || {
      id: `item-${Date.now()}`,
      title: `${pcbConfig.layers}-Layer ${selectedSubstrate.name}`,
      dimensions: `${pcbConfig.length} × ${pcbConfig.width} mm`,
      quantity: pcbConfig.quantity,
      layers: pcbConfig.layers,
      finish: pcbConfig.surfaceFinish.name,
      solderMask: pcbConfig.solderMask.name,
      turnaround: pcbConfig.turnaround === 'express' ? 'Express (24-48h)' : 'Standard (3-4 Days)',
      price: calculateCurrentTotal()
    };
    setCartItems(prev => [newItem, ...prev]);
    setIsCartOpen(true);
    showToast(`Added ${newItem.title} to fabrication cart!`);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Dynamic Total Calculation helper
  const calculateCurrentTotal = () => {
    const areaM2 = (pcbConfig.length * pcbConfig.width) / 1000000;
    const areaFactor = Math.max(1, areaM2 / 0.008);
    let baseFab = 299 * areaFactor;

    if (pcbConfig.layers === 4) baseFab += 450;
    else if (pcbConfig.layers === 6) baseFab += 950;
    else if (pcbConfig.layers >= 8) baseFab += 1600;

    const finishExtra = pcbConfig.surfaceFinish.extra || 0;
    const speedExtra = pcbConfig.turnaround === 'express' ? pcbConfig.turnaroundPrice : 0;
    const castellatedExtra = pcbConfig.castellated ? 150 : 0;
    const chamferExtra = pcbConfig.edgeChamfer ? 180 : 0;

    const qtyFactor = pcbConfig.quantity === 5 ? 1 : (pcbConfig.quantity / 5) * 0.8;
    const subtotal = (baseFab * qtyFactor) + finishExtra + speedExtra + castellatedExtra + chamferExtra;
    
    return Math.round(subtotal);
  };

  return (
    <ConfigContext.Provider
      value={{
        currency,
        toggleCurrency,
        formatPrice,
        selectedDemographic,
        setSelectedDemographic,
        selectedSubstrate,
        setSelectedSubstrate,
        pcbConfig,
        setPcbConfig,
        cartItems,
        setCartItems,
        isCartOpen,
        setIsCartOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        activeOrder,
        setActiveOrder,
        addToCart,
        removeFromCart,
        calculateCurrentTotal,
        toastMessage,
        showToast
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
