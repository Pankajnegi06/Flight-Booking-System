import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getFlights, getFlightById, bookFlight, clearSelectedFlight, resetFlight } from './flightSlice';
import { updateWallet } from '../auth/authSlice';
import { addBooking } from '../bookings/bookingSlice';
import FlightCard from './FlightCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { MdFlight, MdClose, MdDownload, MdCheckCircle, MdWarning, MdArrowForward } from 'react-icons/md';
import toast from 'react-hot-toast';

const FlightSearch = () => {
  const dispatch = useDispatch();
  const { flights, selectedFlight, isLoading, isError, message } = useSelector((state) => state.flights);
  const { user } = useSelector((state) => state.auth);
  
  const [showModal, setShowModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price_low');
  const [filterAirline, setFilterAirline] = useState('all');

  useEffect(() => {
    dispatch(getFlights());
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
      dispatch(resetFlight());
    }
  }, [isError, message, dispatch]);

  // Filter and Sort Logic
  const filteredFlights = flights
    .filter((flight) => {
      const matchesSearch = 
        flight.departure_city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flight.arrival_city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAirline = filterAirline === 'all' || flight.airline === filterAirline;
      return matchesSearch && matchesAirline;
    })
    .sort((a, b) => {
      if (sortBy === 'price_low') return a.current_price - b.current_price;
      if (sortBy === 'price_high') return b.current_price - a.current_price;
      return 0;
    });

  const uniqueAirlines = [...new Set(flights.map(f => f.airline))];

  const handleFlightSelect = async (flight) => {
    if (!user?._id) return;
    
    const result = await dispatch(getFlightById({ userId: user._id, flightId: flight.flightId }));
    if (result.payload) {
      setShowModal(true);
    }
  };

  const handleBooking = async () => {
    if (!user?._id || !selectedFlight) return;
    
    if (user.wallet < selectedFlight.current_price) {
      toast.error('Insufficient wallet balance!');
      return;
    }

    setIsBooking(true);
    try {
      const result = await dispatch(bookFlight({ 
        userId: user._id, 
        flightId: selectedFlight.flightId 
      }));
      
      if (result.payload?.booking) {
        const newBalance = user.wallet - selectedFlight.current_price;
        dispatch(updateWallet(newBalance));
        dispatch(addBooking(result.payload.booking));
        setBookingSuccess(result.payload.booking);
        toast.success('Flight booked successfully!');
      } else if (result.error) {
        toast.error(result.payload || 'Booking failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsBooking(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setBookingSuccess(null);
    dispatch(clearSelectedFlight());
  };

  const handleDownloadTicket = () => {
    if (bookingSuccess?.ticket_url) {
      window.open(bookingSuccess.ticket_url, '_blank');
    }
  };

  if (isLoading && flights.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" text="Finding best flights..." />
      </div>
    );
  }

  return (
    <div className="fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
          Where to <span className="gradient-text">Next?</span>
        </h1>
        <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
          Discover premium flights at the best prices. Book your next adventure in seconds.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 border-white/10">
        <div className="w-full md:w-1/3 relative">
          <input
            type="text"
            placeholder="Search city (e.g. Delhi, Mumbai)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-colors"
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <select
            value={filterAirline}
            onChange={(e) => setFilterAirline(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 transition-colors cursor-pointer"
          >
            <option value="all" className="bg-gray-900">All Airlines</option>
            {uniqueAirlines.map(airline => (
              <option key={airline} value={airline} className="bg-gray-900">{airline}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 transition-colors cursor-pointer"
          >
            <option value="price_low" className="bg-gray-900">Price: Low to High</option>
            <option value="price_high" className="bg-gray-900">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Flight Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {filteredFlights.map((flight, index) => (
          <FlightCard
            key={flight._id || index}
            flight={flight}
            onSelect={handleFlightSelect}
            isSelected={selectedFlight?.flightId === flight.flightId}
          />
        ))}
      </div>

      {flights.length === 0 && !isLoading && (
        <div className="glass-card p-16 text-center max-w-2xl mx-auto mt-10">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdFlight className="text-6xl text-gray-600" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No Flights Available</h3>
          <p className="text-gray-400">We couldn't find any flights at the moment. Please check back later.</p>
        </div>
      )}

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="glass-card max-w-md w-full p-0 overflow-hidden fade-in shadow-2xl shadow-blue-900/20 border-white/10">
            {!bookingSuccess ? (
              <>
                {/* Modal Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                  <h2 className="text-xl font-bold text-white tracking-wide">
                    {isLoading ? 'Updating Price...' : 'Confirm Booking'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  >
                    <MdClose className="text-xl" />
                  </button>
                </div>

                <div className="p-6">
                  {isLoading ? (
                    <div className="py-12 flex justify-center">
                      <LoadingSpinner text="Fetching latest price..." />
                    </div>
                  ) : selectedFlight && (
                    <>
                      {/* Flight Details */}
                      <div className="space-y-6 mb-8">
                        {/* Route Summary */}
                        <div className="flex items-center justify-between bg-white/5 p-5 rounded-2xl border border-white/5">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">{selectedFlight.departure_city.substring(0, 3).toUpperCase()}</p>
                            <p className="text-xs text-gray-400 uppercase">{selectedFlight.departure_city}</p>
                          </div>
                          <MdArrowForward className="text-cyan-400 text-xl opacity-50" />
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">{selectedFlight.arrival_city.substring(0, 3).toUpperCase()}</p>
                            <p className="text-xs text-gray-400 uppercase">{selectedFlight.arrival_city}</p>
                          </div>
                        </div>

                        {/* Airline Info */}
                        <div className="flex items-center gap-4 px-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                            <MdFlight className="text-white text-xl rotate-45" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-lg">{selectedFlight.airline}</p>
                            <p className="text-sm text-gray-400 font-mono">{selectedFlight.flightId}</p>
                          </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-gray-300">Ticket Price</span>
                            <div className="text-right">
                              {selectedFlight.current_price > selectedFlight.base_price && (
                                <p className="text-xs text-gray-500 line-through mb-1">
                                  ₹{selectedFlight.base_price.toLocaleString('en-IN')}
                                </p>
                              )}
                              <p className={`text-xl font-bold ${
                                selectedFlight.current_price > selectedFlight.base_price 
                                  ? 'surge-price' 
                                  : 'text-emerald-400'
                              }`}>
                                ₹{(selectedFlight.current_price !== undefined && !isNaN(selectedFlight.current_price)) ? selectedFlight.current_price.toLocaleString('en-IN') : 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-gray-300">Wallet Balance</span>
                            <span className={`font-bold ${
                              (user?.wallet || 0) >= (selectedFlight.current_price || 0)
                                ? 'text-emerald-400' 
                                : 'text-red-400'
                            }`}>
                              ₹{(user?.wallet !== undefined && !isNaN(user.wallet)) ? user.wallet.toLocaleString('en-IN') : '0'}
                            </span>
                          </div>
                        </div>

                        {/* Insufficient Balance Warning */}
                        {user?.wallet < selectedFlight.current_price && (
                          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <MdWarning className="text-red-400 text-2xl flex-shrink-0" />
                            <p className="text-sm text-red-300 font-medium">Insufficient wallet balance. Please recharge to proceed.</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={closeModal}
                          className="btn-secondary w-full"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleBooking}
                          disabled={isBooking || user?.wallet < selectedFlight.current_price}
                          className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                          {isBooking ? (
                            <div className="spinner w-5 h-5 border-2" />
                          ) : (
                            'Pay & Book'
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              /* Success State */
              <div className="text-center p-8">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <MdCheckCircle className="text-6xl text-emerald-400" />
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h2>
                <p className="text-gray-400 mb-8">Your ticket has been generated successfully.</p>

                <div className="glass-card p-6 mb-8 text-left bg-white/5 border-white/10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-gray-400 text-sm uppercase tracking-wider">PNR Number</span>
                      <span className="text-white font-mono font-bold text-lg">{bookingSuccess.pnr}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Amount Paid</span>
                      <span className="text-emerald-400 font-bold text-lg">
                        ₹{bookingSuccess.price_paid?.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Route</span>
                      <span className="text-white font-medium">{bookingSuccess.route}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={closeModal} className="btn-secondary w-full">
                    Close
                  </button>
                  <button
                    onClick={handleDownloadTicket}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <MdDownload className="text-xl" /> Download Ticket
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
