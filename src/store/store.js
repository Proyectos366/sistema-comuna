import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/features/auth/authSlice"

const store = configureStore({
  reducer: {
    auth: authReducer
    // Aquí se agregarán los reducers de los "slices"
  },
});

export default store;
