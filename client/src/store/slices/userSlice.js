import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  status: false,
  loading: false,
  error: '',
  success:'',
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
      // console.log(action.payload)
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
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    clearSuccess: (state) => {
      state.success = '';
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
  setSuccess,
  clearSuccess,
} = userSlice.actions;

export default userSlice.reducer;
