import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getBookingHistory } from './bookingSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import { MdFlight, MdDownload } from 'react-icons/md';
import toast from 'react-hot-toast';

const BookingHistory = () => {
  const dispatch = useDispatch();
  const { bookings, isLoading, isError, message } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?._id) {
      dispatch(getBookingHistory(user._id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }
  }, [isError, message]);

  const handleDownload = (ticketUrl) => {
    window.open(ticketUrl, '_blank');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" text="Loading your bookings..." />
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ paddingTop: '1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="text-3xl font-bold text-white" style={{ marginBottom: '0.5rem' }}>My Bookings</h1>
        <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>
          View and download tickets for all your booked flights
        </p>
      </div>

      {/* Bookings Grid */}
      {bookings && bookings.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {bookings.map((booking, index) => (
            <div
              key={booking._id || index}
              className="glass-card stagger-item hover:bg-white/5 transition-all"
              style={{ padding: '1rem' }}
            >
              {/* Top: Airline + Price */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div 
                    className="bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center"
                    style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem' }}
                  >
                    <MdFlight className="text-white text-lg rotate-45" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="font-semibold text-white">{booking.airline}</span>
                      <span 
                        className="text-cyan-400 bg-cyan-500/10"
                        style={{ padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '500' }}
                      >
                        {booking.flightId}
                      </span>
                    </div>
                    <span className="text-gray-400" style={{ fontSize: '0.8rem' }}>{booking.route}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className="text-emerald-400 font-bold" style={{ fontSize: '1.25rem' }}>
                    ₹{booking.price_paid?.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Middle: PNR + Date */}
              <div 
                className="bg-white/5 border border-white/5"
                style={{ padding: '0.6rem 0.75rem', borderRadius: '0.5rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="text-gray-500" style={{ fontSize: '0.7rem' }}>PNR:</span>
                  <span className="text-white font-mono" style={{ fontSize: '0.75rem' }}>{booking.pnr}</span>
                </div>
                <div className="text-gray-400" style={{ fontSize: '0.75rem' }}>
                  {formatDate(booking.bookingTime)} • {formatTime(booking.bookingTime)}
                </div>
              </div>

              {/* Bottom: Amount + Download */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="text-gray-500" style={{ fontSize: '0.7rem' }}>Amount Paid</span>
                  <p className="text-white font-medium" style={{ fontSize: '0.9rem' }}>₹{booking.price_paid?.toLocaleString('en-IN')}</p>
                </div>
                <button
                  onClick={() => handleDownload(booking.ticket_url)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-1"
                  style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}
                >
                  <MdDownload style={{ fontSize: '1rem' }} />
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card text-center" style={{ padding: '3rem' }}>
          <div 
            className="bg-blue-500/10 flex items-center justify-center mx-auto"
            style={{ width: '4rem', height: '4rem', borderRadius: '9999px', marginBottom: '1rem' }}
          >
            <MdFlight className="text-2xl text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white" style={{ marginBottom: '0.5rem' }}>No Bookings Yet</h3>
          <p className="text-gray-400" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
            You haven't booked any flights yet. Start exploring!
          </p>
          <a 
            href="/" 
            className="btn-primary inline-flex items-center gap-2"
            style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem' }}
          >
            <MdFlight /> Browse Flights
          </a>
        </div>
      )}

      {/* Summary Stats */}
      {bookings && bookings.length > 0 && (
        <div 
          className="glass-card"
          style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}
        >
          <div>
            <p className="gradient-text font-bold" style={{ fontSize: '1.75rem' }}>{bookings.length}</p>
            <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>Total Bookings</p>
          </div>
          <div>
            <p className="text-emerald-400 font-bold" style={{ fontSize: '1.75rem' }}>
              ₹{bookings.reduce((sum, b) => sum + (b.price_paid || 0), 0).toLocaleString('en-IN')}
            </p>
            <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>Total Spent</p>
          </div>
          <div>
            <p className="text-cyan-400 font-bold" style={{ fontSize: '1.75rem' }}>
              {new Set(bookings.map(b => b.airline)).size}
            </p>
            <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>Airlines Flown</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
