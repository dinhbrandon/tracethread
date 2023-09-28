import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
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

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch & ThunkDispatch<RootState, unknown, Action<string>>;

export const persistor = persistStore(store);

export default store;
