import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const customizedMiddleware = (getDefaultMiddleware: any) =>
  getDefaultMiddleware({
    serializableCheck: false,
  });

const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: customizedMiddleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export default store;
