import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import flightReducer from '../features/flights/flightSlice';
import bookingReducer from '../features/bookings/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flights: flightReducer,
    bookings: bookingReducer,
  },
  devTools: import.meta.env.DEV,
});
