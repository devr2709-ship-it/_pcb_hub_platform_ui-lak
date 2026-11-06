import React from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    formatPrice,
    setIsCheckoutModalOpen
  } = useConfig();

  if (!isCartOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-inverse-surface/50 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-container-lowest shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-space-md border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[22px]">shopping_bag</span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Fabrication Cart ({cartItems.length})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="p-space-md overflow-y-auto space-y-space-md grow">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <span className="material-symbols-outlined text-[48px] text-outline-variant block mb-2">
                  shopping_cart_checkout
                </span>
                <p className="font-headline-sm text-sm font-semibold text-on-surface mb-1">Your cart is empty</p>
                <p className="font-body-sm text-xs mb-4">Configure your PCB board specs or browse project lines.</p>
                <Link
                  to="/custom-pcb"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold"
                >
                  Configure PCB Now
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/30 flex flex-col justify-between gap-space-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-headline-sm text-sm font-bold text-on-surface">
                        {item.title}
                      </h4>
                      <p className="font-label-sm text-[11px] text-on-surface-variant mt-0.5">
                        {item.dimensions} • {item.quantity} Pcs • {item.finish}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-on-surface-variant hover:text-error transition-colors p-1"
                      title="Remove Item"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                    <span className="bg-surface-container px-2 py-0.5 rounded text-on-surface">
                      Mask: {item.solderMask}
                    </span>
                    <span className="bg-surface-container px-2 py-0.5 rounded text-secondary font-semibold">
                      {item.turnaround}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                    <span className="font-label-sm text-xs text-on-surface-variant">Batch Price</span>
                    <span className="font-headline-sm text-base font-bold text-primary">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cartItems.length > 0 && (
            <div className="p-space-md border-t border-outline-variant/30 bg-surface-container-low space-y-space-sm">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-on-surface">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>GST (18% with Input Tax Credit)</span>
                  <span className="font-mono font-semibold text-on-surface">
                    {formatPrice(gst)}
                  </span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Shipping across India</span>
                  <span className="font-mono font-bold text-secondary">FREE</span>
                </div>
                <div className="border-t border-outline-variant/20 pt-1.5 flex justify-between font-bold text-sm text-on-surface">
                  <span>Total Amount</span>
                  <span className="text-primary text-base font-headline-sm">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenCheckout}
                className="w-full py-3 bg-primary text-on-primary rounded-xl font-headline-sm text-sm font-bold shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>Proceed to Domestic Checkout</span>
              </button>

              <div className="text-center text-[10px] text-on-surface-variant flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-secondary text-[12px]">verified</span>
                <span>100% Free Remanufacture Guarantee • UPI &amp; GST Ready</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
