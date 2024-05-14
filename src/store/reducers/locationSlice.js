import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  locationData: null,
  loading: false, // Optional flag for loading state
  error: null, // Optional flag for error state
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    fetchLocationRequest: (state) => {
      state.loading = true; // Set loading state to true (optional)
      state.error = null; // Clear any previous error (optional)
    },
    fetchLocationSuccess: (state, action) => {
      state.loading = false; // Set loading state to false (optional)
      state.locationData = action.payload;
    },
    fetchLocationFailure: (state, action) => {
      state.loading = false; // Set loading state to false (optional)
      state.error = action.payload; // Set error message (optional)
    },
  },
});

export const {
  fetchLocationRequest,
  fetchLocationSuccess,
  fetchLocationFailure,
} = locationSlice.actions;

export default locationSlice.reducer;
