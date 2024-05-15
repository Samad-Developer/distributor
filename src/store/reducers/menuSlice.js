import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  menuItems: [],
  loading: false, // Optional flag for loading state
  error: null, // Optional flag for error state
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    fetchMenuItemsRequest: (state) => {
      state.loading = true; // Set loading state to true (optional)
      state.error = null; // Clear any previous error (optional)
    },
    fetchMenuItemsSuccess: (state, action) => {
      state.loading = false; // Set loading state to false (optional)
      const menu = action.payload.filter(
        (item) => item.Is_Displayed_In_Menu
      ); 
      state.menuItems = menu
      localStorage.setItem('menuItems', JSON.stringify(menu))
    },
    fetchMenuItemsFailure: (state, action) => {
      state.loading = false; // Set loading state to false (optional)
      state.error = action.payload; // Set error message (optional)
    },
  },
});

export const {
  fetchMenuItemsRequest,
  fetchMenuItemsSuccess,
  fetchMenuItemsFailure,
} = menuSlice.actions;

export default menuSlice.reducer;
