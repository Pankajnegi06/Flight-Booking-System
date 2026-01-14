import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  flights: [],
  selectedFlight: null,
  isLoading: false,
  isError: false,
  message: '',
};

// Get all flights
export const getFlights = createAsyncThunk(
  'flights/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/flights/flightSearch');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch flights';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get flight by ID (triggers dynamic pricing)
export const getFlightById = createAsyncThunk(
  'flights/getById',
  async ({ userId, flightId }, thunkAPI) => {
    try {
      const response = await api.get(`/flights/flightbyId?userId=${userId}&flightId=${flightId}`);
      return response.data.flight;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch flight';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Book flight
export const bookFlight = createAsyncThunk(
  'flights/book',
  async ({ userId, flightId }, thunkAPI) => {
    try {
      const response = await api.get(`/flights/booking?userId=${userId}&flightId=${flightId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Booking failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const flightSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    resetFlight: (state) => {
      state.isError = false;
      state.message = '';
    },
    clearSelectedFlight: (state) => {
      state.selectedFlight = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all flights
      .addCase(getFlights.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFlights.fulfilled, (state, action) => {
        state.isLoading = false;
        state.flights = action.payload;
      })
      .addCase(getFlights.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get flight by ID
      .addCase(getFlightById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFlightById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedFlight = action.payload;
      })
      .addCase(getFlightById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Book flight
      .addCase(bookFlight.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(bookFlight.fulfilled, (state) => {
        state.isLoading = false;
        state.selectedFlight = null;
      })
      .addCase(bookFlight.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetFlight, clearSelectedFlight } = flightSlice.actions;
export default flightSlice.reducer;
