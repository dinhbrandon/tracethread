import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import jobReducer from './jobSlice';

const persistConfigAuth = {
  key: 'auth',
  storage,
};

const persistConfigJob = {
  key: 'job',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfigAuth, authReducer);
const persistedJobReducer = persistReducer(persistConfigJob, jobReducer);

const customizedMiddleware = (getDefaultMiddleware: any) =>
  getDefaultMiddleware({
    serializableCheck: false,
  });

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    job: persistedJobReducer
  },
  middleware: customizedMiddleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export default store;
