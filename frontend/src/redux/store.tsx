import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import jobReducer from './jobSlice';

//Configure object for redux-persist for the auth reducer
const persistConfigAuth = {
  key: 'auth',
  storage,
};

// Configuration object for redux-persist for the job reducer
const persistConfigJob = {
  key: 'job',
  storage,
};

// Creating persisted reducers using the configuration objects
const persistedAuthReducer = persistReducer(persistConfigAuth, authReducer);
const persistedJobReducer = persistReducer(persistConfigJob, jobReducer);

// Customized middleware to ignore serializableCheck
// This is usually done to avoid warnings when non-serializable values are used
const customizedMiddleware = (getDefaultMiddleware: any) =>
  getDefaultMiddleware({
    serializableCheck: false,
  });

// Configuring the store with reducers, middleware, and enhancers
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    job: persistedJobReducer
  },
  middleware: customizedMiddleware
});

// Defining a type for thunk actions to be used in async action creators
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Defining the RootState type based on the state shape of the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch & ThunkDispatch<RootState, unknown, Action<string>>;

// Creating a persistor to enable persisted state
export const persistor = persistStore(store);

export default store;
