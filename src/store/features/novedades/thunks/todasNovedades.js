import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todas las novedades con manejo de errores
export const fetchNovedades = createAsyncThunk(
  "novedades/fetchNovedades",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/novedades/todas-novedades");
      return response.data.novedades;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener los novedades",
      );
    }
  },
);
