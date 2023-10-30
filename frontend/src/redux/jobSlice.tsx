import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JobListing } from '../types/types';

interface JobState {
  jobsByUser: {
    [username: string]: JobListing[];
  };
  jobAdditionStatus: 'idle' | 'added' | 'duplicate';
}

const initialState: JobState = {
  jobsByUser: {},
  jobAdditionStatus: 'idle'
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    addJobToNotebook: (state, action: PayloadAction<{ job: JobListing, username: string }>) => {
      const { job, username } = action.payload;

      if (!state.jobsByUser[username]) {
        state.jobsByUser[username] = [];
      }

      const existingJob = state.jobsByUser[username].find(j => j.id === job.id);

      if (existingJob) {
        state.jobAdditionStatus = 'duplicate';
      } else {
        state.jobsByUser[username].push(job);
        state.jobAdditionStatus = 'added';
      }
    },
    removeJobFromNotebook: (state, action: PayloadAction<{ jobId: number, username: string }>) => {
      const { jobId, username } = action.payload;
      if (state.jobsByUser[username]) {
        state.jobsByUser[username] = state.jobsByUser[username].filter(job => job.id !== jobId);
      }
    },    
    resetJobAdditionStatus: (state) => {
      state.jobAdditionStatus = 'idle';
    }
  }
});

export const { addJobToNotebook, removeJobFromNotebook, resetJobAdditionStatus } = jobSlice.actions;
export default jobSlice.reducer;
