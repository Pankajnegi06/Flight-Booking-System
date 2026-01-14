import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { MdFlight, MdHistory, MdLogout, MdSearch, MdAccountBalanceWallet } from 'react-icons/md';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-6 z-50 px-4 mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card px-6 py-4 flex items-center justify-between bg-opacity-80 backdrop-blur-xl border-opacity-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
              <MdFlight className="text-xl text-white rotate-45" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block tracking-tight">SkyBook</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive('/')
                  ? 'text-cyan-400 font-bold bg-white/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <MdSearch className="text-xl" />
              <span className="hidden sm:inline font-medium">Flights</span>
            </Link>

            <Link
              to="/bookings"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive('/bookings')
                  ? 'text-cyan-400 font-bold bg-white/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <MdHistory className="text-xl" />
              <span className="hidden sm:inline font-medium">My Bookings</span>
            </Link>
          </div>

          {/* User Info & Wallet */}
          <div className="flex items-center gap-6">
            {/* Wallet */}
            <div className="wallet-badge flex items-center gap-2 group cursor-default">
              <div className="p-1.5 bg-emerald-500/20 rounded-full group-hover:bg-emerald-500/30 transition-colors">
                <MdAccountBalanceWallet className="text-lg text-emerald-400" />
              </div>
              <span className="tracking-wide">₹{(user?.wallet !== undefined && !isNaN(user.wallet)) ? user.wallet.toLocaleString('en-IN') : '50,000'}</span>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-white tracking-wide">{user?.name}</p>
                <p className="text-xs text-gray-400 font-medium">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-transparent rounded-xl transition-all duration-300 group"
                title="Logout"
              >
                <MdLogout className="text-xl group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
