import React, { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { trackOrder } from '../services/api.js';

export const TrackOrderPage = () => {
  const { showToast } = useConfig();
  const [orderQuery, setOrderQuery] = useState('PCB-84920');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrder = async (id) => {
    if (!id.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await trackOrder(id.trim().toUpperCase());
      setOrder(data.order);
    } catch (err) {
      setOrder(null);
      setError(err.message || 'Order not found.');
      showToast(err.message || 'Order not found.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load default order on mount
  useEffect(() => { fetchOrder('PCB-84920'); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrder(orderQuery);
  };

  const milestones = order?.milestones || [];
  const telemetry = order?.cleanroomTelemetry || {};

  return (
    <div className="flex flex-col w-full py-space-xl">
      <div className="w-full max-w-[1440px] mx-auto px-margin space-y-space-xl">
        {/* Header & Search Bar */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg lg:p-space-xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-space-xs bg-surface-container px-3 py-1 rounded-full text-secondary font-mono text-xs font-bold mb-space-sm">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              IOT FABRICATION SENSOR NETWORK
            </div>
            <h1 className="font-headline-xl text-2xl sm:text-3xl lg:text-4xl text-on-surface font-bold tracking-tight mb-space-xs">
              Live Production Lot Tracker
            </h1>
            <p className="font-body-lg text-sm text-on-surface-variant">
              Watch your printed circuit board panel navigate real-time cleanroom barcode checkpoints.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="Enter Order # (e.g. PCB-84920)"
              className="px-3 py-2 bg-surface-container-low rounded-xl font-mono text-xs border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary w-52"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-on-primary rounded-xl font-headline-sm text-xs font-bold hover:bg-primary-container transition-colors disabled:opacity-60 flex items-center gap-1"
            >
              {loading && <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>}
              Track Lot
            </button>
          </form>
        </div>

        {/* Error State */}
        {error && !order && (
          <div className="bg-error-container text-on-error-container rounded-2xl p-space-lg flex items-center gap-space-md">
            <span className="material-symbols-outlined text-[28px]">search_off</span>
            <div>
              <p className="font-headline-sm text-sm font-bold">Order Not Found</p>
              <p className="font-body-sm text-xs opacity-80">{error}</p>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-sm animate-pulse h-20" />
            ))}
          </div>
        )}

        {/* Telemetry HUD Cards */}
        {order && !loading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-sm">
                <span className="font-mono text-[10px] text-on-surface-variant block uppercase font-bold">Active Lot ID</span>
                <span className="font-mono text-base font-bold text-primary block mt-1">#{order.orderId}</span>
                <span className="font-mono text-[11px] text-secondary font-semibold">
                  {order.items?.[0]?.specs || '5 Pcs • 2-Layer FR-4'}
                </span>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-sm">
                <span className="font-mono text-[10px] text-on-surface-variant block uppercase font-bold">Current Cleanroom Bay</span>
                <span className="font-mono text-sm font-bold text-on-surface block mt-1">{order.currentStation}</span>
                <span className="font-mono text-[11px] text-primary font-semibold">{order.status?.replace(/_/g, ' ')}</span>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-sm">
                <span className="font-mono text-[10px] text-on-surface-variant block uppercase font-bold">Ambient Cleanroom Sensor</span>
                <span className="font-mono text-base font-bold text-on-surface block mt-1">
                  {telemetry.temperatureCelsius}°C • {telemetry.relativeHumidity}% RH
                </span>
                <span className="font-mono text-[11px] text-secondary font-semibold">{telemetry.isoCleanroomClass}</span>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 shadow-sm">
                <span className="font-mono text-[10px] text-on-surface-variant block uppercase font-bold">Estimated Air Dispatch</span>
                <span className="font-mono text-base font-bold text-secondary block mt-1">{order.estimatedDispatch}</span>
                <span className="font-mono text-[11px] text-on-surface-variant">Bluedart Air Express</span>
              </div>
            </div>

            {/* Vertical Timeline */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-lg lg:p-space-xl border border-outline-variant/30 shadow-sm">
              <div className="flex items-center justify-between pb-space-md mb-space-lg border-b border-outline-variant/20">
                <div>
                  <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider">STATION CHECKPOINTS</span>
                  <h2 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface">
                    Manufacturing Telemetry History
                  </h2>
                </div>
                <span className="font-mono text-xs bg-surface-container px-3 py-1 rounded-full text-on-surface font-semibold">
                  Live Station Updates
                </span>
              </div>

              <div className="relative pl-6 sm:pl-8 space-y-space-lg before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/40">
                {milestones.map((m) => {
                  const isCompleted = m.status === 'completed';
                  const isCurrent = m.status === 'current';
                  return (
                    <div key={m.id} className="relative">
                      <div className={`absolute -left-[30px] sm:-left-[38px] top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted ? 'bg-secondary text-on-secondary shadow-sm'
                          : isCurrent ? 'bg-primary text-on-primary ring-4 ring-primary/20 shadow-md animate-pulse'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}>
                        {isCompleted
                          ? <span className="material-symbols-outlined text-[14px]">check</span>
                          : <span className="font-mono text-[10px]">{m.id}</span>
                        }
                      </div>
                      <div className={`p-space-md rounded-2xl border transition-all ${
                        isCurrent ? 'bg-primary-fixed/20 border-primary shadow-sm'
                          : 'bg-surface-container-low/60 border-outline-variant/20'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h3 className="font-headline-sm text-sm font-bold text-on-surface">{m.title}</h3>
                          <span className={`font-mono text-xs font-bold ${
                            isCurrent ? 'text-primary' : isCompleted ? 'text-secondary' : 'text-on-surface-variant'
                          }`}>{m.time}</span>
                        </div>
                        <span className="font-mono text-[11px] text-on-surface-variant block mb-1">{m.station}</span>
                        <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">{m.details}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
