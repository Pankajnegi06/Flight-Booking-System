import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  bookings: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Get booking history
export const getBookingHistory = createAsyncThunk(
  'bookings/getHistory',
  async (userId, thunkAPI) => {
    try {
      const response = await api.get(`/flights/bookingHistory?userId=${userId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch booking history';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    resetBookings: (state) => {
      state.isError = false;
      state.message = '';
    },
    addBooking: (state, action) => {
      state.bookings.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBookingHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBookingHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(getBookingHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetBookings, addBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
