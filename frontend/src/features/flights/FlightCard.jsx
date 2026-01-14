import { useEffect, useState } from 'react';
import { MdFlight, MdArrowForward, MdAccessTime, MdTrendingUp, MdTimer } from 'react-icons/md';
import { IoAirplaneSharp } from "react-icons/io5";

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
  
  return (
    <div
      onClick={() => onSelect(flight)}
      className={`glass-card glass-card-hover p-10 cursor-pointer transition-all duration-300 stagger-item group relative overflow-hidden ${
        isSelected ? 'ring-2 ring-cyan-400 bg-white/5' : ''
      }`}
    >
      {/* Selection Glow */}
      {isSelected && (
        <div className="absolute inset-0 bg-cyan-400/5 pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <MdFlight className="text-white text-3xl rotate-45" />
          </div>
          <div>
            <h3 className="font-bold text-white text-xl tracking-wide mb-1">{flight.airline}</h3>
            <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-gray-400 font-mono tracking-wider">
              {flight.flightId}
            </span>
          </div>
        </div>
        
        {/* Surge Indicator */}
        {hasSurge && (
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full backdrop-blur-md">
              <MdTrendingUp className="text-amber-400 text-sm" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Surge</span>
            </div>
            {timeLeft && (
              <div className="flex items-center gap-1 text-amber-400/80 text-xs font-mono">
                <MdTimer />
                <span>{timeLeft}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Route Visualization */}
      <div className="flex items-center justify-between mb-12 relative z-10">
        <div className="text-center min-w-[80px]">
          <p className="text-3xl font-bold text-white mb-2 tracking-tight">{flight.departure_city.substring(0, 3).toUpperCase()}</p>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">{flight.departure_city}</p>
        </div>
        
        <div className="flex-1 px-6 flex flex-col items-center">
          <div className="w-full relative flex items-center h-8">
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-30"></div>
            <div className="w-full h-[2px] absolute top-1/2 left-0 -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
            <IoAirplaneSharp className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-cyan-400 text-2xl transform rotate-90 group-hover:translate-x-8 transition-transform duration-700" />
          </div>
          <p className="text-xs text-gray-500 mt-3 font-mono tracking-widest uppercase">Direct</p>
        </div>
        
        <div className="text-center min-w-[80px]">
          <p className="text-3xl font-bold text-white mb-2 tracking-tight">{flight.arrival_city.substring(0, 3).toUpperCase()}</p>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">{flight.arrival_city}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between pt-8 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-2.5 text-gray-400 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
          <MdAccessTime className="text-cyan-400 text-lg" />
          <span className="text-sm font-medium font-mono">
            {new Date(flight.arrival_time).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        
        <div className="text-right">
          {hasSurge && (
            <p className="text-xs text-gray-500 line-through mb-0.5">
              ₹{flight.base_price.toLocaleString('en-IN')}
            </p>
          )}
          <p className={`text-2xl font-bold tracking-tight ${hasSurge ? 'surge-price' : 'text-emerald-400'}`}>
            ₹{(flight.current_price !== undefined && !isNaN(flight.current_price)) ? flight.current_price.toLocaleString('en-IN') : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
