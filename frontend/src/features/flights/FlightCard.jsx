import { useEffect, useState } from 'react';
import { MdFlight, MdAccessTime, MdTrendingUp } from 'react-icons/md';

const FlightCard = ({ flight, onSelect, isSelected }) => {
  const hasSurge = flight.current_price > flight.base_price;
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (flight.surge_active_until) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const surgeEnd = new Date(flight.surge_active_until).getTime();
        const distance = surgeEnd - now;

        if (distance < 0) {
          clearInterval(interval);
          setTimeLeft(null);
        } else {
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [flight.surge_active_until]);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };
  
  return (
    <div
      onClick={() => onSelect(flight)}
      className={`glass-card cursor-pointer transition-all duration-300 stagger-item group relative overflow-hidden ${
        isSelected ? 'ring-2 ring-cyan-400 bg-white/5' : ''
      }`}
      style={{ padding: '1.25rem' }}
    >
      {/* Selection Glow */}
      {isSelected && (
        <div className="absolute inset-0 bg-cyan-400/5 pointer-events-none" />
      )}

      {/* Top Row: Airline + Route + Surge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div 
            className="bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center"
            style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem' }}
          >
            <MdFlight className="text-white text-lg rotate-45" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="font-semibold text-white">{flight.airline}</span>
              {hasSurge && (
                <span 
                  className="text-amber-400 bg-amber-500/10 border border-amber-500/20"
                  style={{ padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: '600' }}
                >
                  SURGE
                </span>
              )}
            </div>
            <span className="text-gray-500 text-xs font-mono">{flight.flightId}</span>
          </div>
        </div>
        
        {/* Price */}
        <div style={{ textAlign: 'right' }}>
          {hasSurge && (
            <p className="text-gray-500 line-through" style={{ fontSize: '0.7rem' }}>
              ₹{flight.base_price.toLocaleString('en-IN')}
            </p>
          )}
          <p className={`font-bold text-xl ${hasSurge ? 'text-amber-400' : 'text-emerald-400'}`}>
            ₹{(flight.current_price !== undefined && !isNaN(flight.current_price)) ? flight.current_price.toLocaleString('en-IN') : 'N/A'}
          </p>
        </div>
      </div>

      {/* Route Row */}
      <div 
        className="bg-white/5 border border-white/5"
        style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', marginBottom: '0.75rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p className="text-white font-bold" style={{ fontSize: '1.1rem' }}>
              {flight.departure_city.substring(0, 3).toUpperCase()}
            </p>
            <p className="text-gray-500" style={{ fontSize: '0.7rem' }}>{flight.departure_city}</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '2rem', height: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
            <span className="text-gray-500" style={{ fontSize: '0.65rem' }}>Direct</span>
            <div style={{ width: '2rem', height: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <p className="text-white font-bold" style={{ fontSize: '1.1rem' }}>
              {flight.arrival_city.substring(0, 3).toUpperCase()}
            </p>
            <p className="text-gray-500" style={{ fontSize: '0.7rem' }}>{flight.arrival_city}</p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Time + Surge Timer + Book Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} className="text-gray-400">
            <MdAccessTime style={{ fontSize: '0.9rem' }} className="text-cyan-400" />
            <span style={{ fontSize: '0.75rem' }}>{formatTime(flight.arrival_time)}</span>
          </div>
          
          {timeLeft && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="text-amber-400">
              <MdTrendingUp style={{ fontSize: '0.8rem' }} />
              <span style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>{timeLeft}</span>
            </div>
          )}
        </div>
        
        <button
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
          style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default FlightCard;
