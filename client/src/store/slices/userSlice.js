import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  status: false,
  loading: false,
  error: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = '';
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      console.log(action.payload)
      state.user = action.payload;
      state.status=true;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: () => initialState,
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = '';
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setError,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
