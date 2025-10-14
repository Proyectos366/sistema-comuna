// features/auth/thunks/cerrarSesion.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "@/store/features/auth/authSlice";

export const cerrarSesion = createAsyncThunk(
  "auth/cerrarSesion",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get("/api/login");

      if (response?.data?.status === "ok") {
        dispatch(logout());
        return true;
      } else {
        return rejectWithValue("Error al cerrar sesión");
      }
    } catch (error) {
      return rejectWithValue(error.response?.status || "Error desconocido");
    }
  }
);
