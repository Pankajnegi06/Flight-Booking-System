import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from './authSlice';
import { FiMail, FiLock, FiUser, FiUserPlus } from 'react-icons/fi';
import { MdFlight } from 'react-icons/md';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { name, email, password, confirmPassword } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    dispatch(register({ name, email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md fade-in relative z-10">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 my-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30">
              <MdFlight className="text-4xl text-white rotate-45" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Get Started</h1>
          <p className="text-gray-400 text-lg">Create your account to start booking</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-6 sm:p-8 shadow-2xl border-white/10">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300" style={{ marginBottom: '0.5rem', marginLeft: '0.5rem',marginTop:'0.5rem' }}>
                Full Name
              </label>
              <div className="relative group">
                <FiUser className="absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-400 transition-colors" style={{ left: '1rem', fontSize: '1rem' }} />
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  placeholder="John Doe"
                  required
                  className="input-field"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300" style={{ marginBottom: '0.5rem', marginLeft: '0.25rem' }}>
                Email Address
              </label>
              <div className="relative group">
                <FiMail className="absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-400 transition-colors" style={{ left: '1rem', fontSize: '1rem' }} />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="you@example.com"
                  required
                  className="input-field"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300" style={{ marginBottom: '0.5rem', marginLeft: '0.25rem' }}>
                Password
              </label>
              <div className="relative group">
                <FiLock className="absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-400 transition-colors" style={{ left: '1rem', fontSize: '1rem' }} />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="input-field"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300" style={{ marginBottom: '0.5rem', marginLeft: '0.25rem' }}>
                Confirm Password
              </label>
              <div className="relative group">
                <FiLock className="absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-400 transition-colors" style={{ left: '1rem', fontSize: '1rem' }} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={onChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="input-field"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-3.5 mt-2" style={{marginTop:'1rem',marginBottom:'1rem'}}
            >
              {isLoading ? (
                <div className="spinner w-6 h-6 border-2 " style={{marginTop:'0.5rem'}}/>
              ) : (
                <>
                  <FiUserPlus /> Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-5 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl" style={{marginTop:'0.5rem',marginBottom:'0.5rem'}}>
            <p className="text-sm text-emerald-400 text-center font-medium">
              🎉 New users get ₹50,000 in wallet balance!
            </p>
          </div>

          <div className="mt-5 text-center pt-4 border-t border-white/10">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
