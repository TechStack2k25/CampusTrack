import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
// Default to localStorage for web application
import userReducer from './slices/userSlice'; // Example slice reducer

// Persist configuration
const persistConfig = {
  key: 'CTroot',
  storage,
};

// Combining all reducers
const rootReducer = combineReducers({
  user: userReducer,
  //other reducers
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  //middlewares
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
