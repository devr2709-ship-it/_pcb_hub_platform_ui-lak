import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { placeOrder } from '../services/api.js';

export const CheckoutModal = () => {
  const navigate = useNavigate();
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cartItems,
    setCartItems,
    formatPrice,
    setActiveOrder,
    showToast
  } = useConfig();

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [address, setAddress] = useState({
    name: 'Arjun Sharma',
    company: 'Hardware Innovation Labs',
    addressLine: 'Plot 42, Electronic City Phase 1',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560100',
    gstin: '29AABCH8492K1Z9'
  });
  const [processing, setProcessing] = useState(false);

  if (!isCheckoutModalOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const payload = {
        customer: {
          fullName: address.name,
          email: 'arjun@hardwarelab.in',
          phone: '+91 98450 12345',
          company: address.company
        },
        shippingAddress: {
          address: address.addressLine,
          city: address.city,
          state: address.state,
          pincode: address.pincode
        },
        taxDetails: address.gstin ? {
          gstin: address.gstin,
          companyName: address.company,
          taxCreditEligible: true
        } : null,
        payment: { method: paymentMethod },
        items: cartItems.map(item => ({
          id: item.id,
          title: item.title,
          specs: item.dimensions || item.specs || '',
          quantity: item.quantity || 5,
          price: item.price,
          solderMask: item.solderMask || 'green',
          surfaceFinish: item.surfaceFinish || 'hasl'
        })),
        pricing: {
          subtotalINR: subtotal,
          gstINR: gst,
          shippingINR: subtotal >= 999 ? 0 : 120,
          totalINR: total,
          currency: 'INR'
        }
      };

      const res = await placeOrder(payload);

      setActiveOrder({
        orderId: res.orderId,
        title: cartItems[0]?.title || 'Custom PCB Batch',
        quantity: cartItems[0]?.quantity || 5,
        specs: cartItems[0]?.dimensions || '100×80 mm',
        status: 'Order Placed & Queued for LDI',
        currentStation: 'Station 01 • CAM Verification',
        cleanroomTemp: '21.4°C • 48% RH',
        estimatedDispatch: res.estimatedDispatch || '3–4 Business Days',
        courier: 'Bluedart Air Express'
      });

      setCartItems([]);
      setIsCheckoutModalOpen(false);
      showToast(`Order #${res.orderId} placed successfully!`, 'success');
      navigate('/track-order');
    } catch (err) {
      showToast(err.message || 'Order failed. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={() => !processing && setIsCheckoutModalOpen(false)}
        className="absolute inset-0 bg-inverse-surface/60 backdrop-blur-sm"
      ></div>

      <div className="relative bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-space-lg shadow-2xl border border-outline-variant/30 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-outline-variant/20">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[24px]">lock</span>
            <h3 className="font-headline-sm text-base font-bold text-on-surface">
              Secure Domestic Checkout &amp; GST Invoicing
            </h3>
          </div>
          <button
            onClick={() => !processing && setIsCheckoutModalOpen(false)}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-space-md text-xs">
          {/* Shipping Address */}
          <div className="bg-surface-container-low p-space-md rounded-xl space-y-space-sm border border-outline-variant/20">
            <h4 className="font-headline-sm text-xs font-bold text-on-surface uppercase tracking-wider">
              1. Delivery Cleanroom / Laboratory Address
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
              <div>
                <label className="block text-on-surface-variant mb-1 font-medium">Contact Name</label>
                <input
                  type="text"
                  required
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-surface text-on-surface rounded-lg border border-outline-variant/30"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant mb-1 font-medium">Organization / Lab</label>
                <input
                  type="text"
                  value={address.company}
                  onChange={(e) => setAddress({ ...address, company: e.target.value })}
                  className="w-full px-3 py-1.5 bg-surface text-on-surface rounded-lg border border-outline-variant/30"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-on-surface-variant mb-1 font-medium">Street Address</label>
                <input
                  type="text"
                  required
                  value={address.addressLine}
                  onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                  className="w-full px-3 py-1.5 bg-surface text-on-surface rounded-lg border border-outline-variant/30"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant mb-1 font-medium">City &amp; State</label>
                <input
                  type="text"
                  required
                  value={`${address.city}, ${address.state}`}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-3 py-1.5 bg-surface text-on-surface rounded-lg border border-outline-variant/30"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant mb-1 font-medium">PIN Code</label>
                <input
                  type="text"
                  required
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="w-full px-3 py-1.5 bg-surface text-on-surface rounded-lg border border-outline-variant/30"
                />
              </div>
            </div>
          </div>

          {/* GST Invoicing Details */}
          <div className="bg-surface-container-low p-space-md rounded-xl space-y-space-xs border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <h4 className="font-headline-sm text-xs font-bold text-on-surface uppercase tracking-wider">
                2. Business GST Tax Invoicing
              </h4>
              <span className="font-mono text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-bold">
                18% Input Tax Credit
              </span>
            </div>
            <div>
              <label className="block text-on-surface-variant mb-1 font-medium">GSTIN Number (Optional)</label>
              <input
                type="text"
                value={address.gstin}
                onChange={(e) => setAddress({ ...address, gstin: e.target.value })}
                placeholder="29AABCH8492K1Z9"
                className="w-full px-3 py-1.5 bg-surface text-on-surface rounded-lg font-mono border border-outline-variant/30"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-surface-container-low p-space-md rounded-xl space-y-space-sm border border-outline-variant/20">
            <h4 className="font-headline-sm text-xs font-bold text-on-surface uppercase tracking-wider">
              3. Payment Method
            </h4>
            <div className="grid grid-cols-3 gap-space-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-2.5 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'bg-surface text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                <span>UPI / QR</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'bg-surface text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">credit_card</span>
                <span>Cards / NetBanking</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('po')}
                className={`p-2.5 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'po'
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'bg-surface text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">description</span>
                <span>Institutional PO</span>
              </button>
            </div>

            {paymentMethod === 'upi' && (
              <div className="p-3 bg-surface rounded-lg flex items-center justify-between border border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white p-1 rounded-lg border border-outline-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-[32px] text-primary">qr_code_2</span>
                  </div>
                  <div>
                    <span className="font-bold text-on-surface block">Instant UPI Payment</span>
                    <span className="text-[11px] text-on-surface-variant">PhonePe • Google Pay • Paytm • BHIM</span>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-secondary">Zero Surcharge</span>
              </div>
            )}
          </div>

          {/* Cost Summary & Pay Button */}
          <div className="pt-2 border-t border-outline-variant/20 flex flex-col gap-space-sm">
            <div className="flex items-baseline justify-between font-bold text-sm">
              <span className="text-on-surface">Total Payable (incl. GST):</span>
              <span className="font-headline-sm text-lg text-primary">{formatPrice(total)}</span>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-headline-sm text-sm font-bold shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authorizing Payment &amp; Locking Cleanroom Slot...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Confirm Order &amp; Start 24h Fabrication ({formatPrice(total)})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;

