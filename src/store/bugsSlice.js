import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bugs: [],
  loading: false,
  error: null,
};

const bugsSlice = createSlice({
  name: 'bugs',
  initialState,
  reducers: {
    setBugs(state, action) {
      state.bugs = action.payload;
      state.error = null;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    addBug(state, action) {
      state.bugs.push(action.payload);
    },
    updateBug(state, action) {
      const idx = state.bugs.findIndex(b => b.id === action.payload.id);
      if (idx !== -1) state.bugs[idx] = action.payload;
    },
    removeBug(state, action) {
      state.bugs = state.bugs.filter(b => b.id !== action.payload);
    },
  },
});

export const { setBugs, setLoading, setError, addBug, updateBug, removeBug } = bugsSlice.actions;
export default bugsSlice.reducer;
