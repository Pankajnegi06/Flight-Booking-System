import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getBookingHistory } from './bookingSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import { MdFlight, MdDownload, MdAccessTime, MdConfirmationNumber } from 'react-icons/md';
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
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
        <p className="text-gray-400">
          View and download tickets for all your booked flights
        </p>
      </div>

      {/* Bookings List */}
      {bookings && bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <div
              key={booking._id || index}
              className="glass-card p-10 stagger-item hover:bg-white/5 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                {/* Flight Info */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MdFlight className="text-white text-2xl rotate-45" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white text-lg">{booking.airline}</h3>
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                        {booking.flightId}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 font-medium">{booking.route}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <MdConfirmationNumber className="text-cyan-400" />
                        <span className="font-mono">{booking.pnr}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MdAccessTime />
                        <span>{formatDate(booking.bookingTime)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Amount Paid</p>
                    <p className="text-xl font-bold text-emerald-400">
                      ₹{booking.price_paid?.toLocaleString('en-IN')}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleDownload(booking.ticket_url)}
                    className="btn-primary flex items-center gap-2 whitespace-nowrap"
                  >
                    <MdDownload /> Download Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdFlight className="text-4xl text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Bookings Yet</h3>
          <p className="text-gray-400 mb-6">
            You haven't booked any flights yet. Start exploring available flights!
          </p>
          <a href="/" className="btn-primary inline-flex items-center gap-2">
            <MdFlight /> Browse Flights
          </a>
        </div>
      )}

      {/* Summary Card */}
      {bookings && bookings.length > 0 && (
        <div className="glass-card p-6 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold gradient-text">{bookings.length}</p>
              <p className="text-gray-400 text-sm">Total Bookings</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-400">
                ₹{bookings.reduce((sum, b) => sum + (b.price_paid || 0), 0).toLocaleString('en-IN')}
              </p>
              <p className="text-gray-400 text-sm">Total Spent</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-cyan-400">
                {new Set(bookings.map(b => b.airline)).size}
              </p>
              <p className="text-gray-400 text-sm">Airlines Flown</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
