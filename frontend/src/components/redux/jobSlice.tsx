import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JobListing } from '../SearchResults';

interface JobState {
  selectedJobs: JobListing[];
}

const initialState: JobState = {
  selectedJobs: []
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    addJobToNotebook: (state, action: PayloadAction<JobListing>) => {
      // Check if the job with the same ID already exists in the array
      if (!state.selectedJobs.some(job => job.id === action.payload.id)) {
        state.selectedJobs.push(action.payload);
      }
    },
    removeJobFromNotebook: (state, action: PayloadAction<number>) => {
      state.selectedJobs = state.selectedJobs.filter(job => job.id !== action.payload);
    },    
    clearAllJobs: (state) => {
      state.selectedJobs = [];
    }
  }
});

export const { addJobToNotebook, clearAllJobs, removeJobFromNotebook } = jobSlice.actions;
export default jobSlice.reducer;
