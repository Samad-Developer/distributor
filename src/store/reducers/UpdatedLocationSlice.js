import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  updatedLocationData: null,
  loading: false,
  error: null,
};

const updatedLocationSlice = createSlice({
  name: 'updatedLocation',
  initialState,
  reducers: {
    fetchUpdatedLocationRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUpdatedLocationSuccess: (state, action) => {
      state.loading = false;
      state.updatedLocationData = action.payload;
      localStorage.setItem('UpdatedLocationData', JSON.stringify(action.payload));
    },
    fetchUpdatedLocationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchUpdatedLocationRequest,
  fetchUpdatedLocationSuccess,
  fetchUpdatedLocationFailure,
} = updatedLocationSlice.actions;

export default updatedLocationSlice.reducer;
