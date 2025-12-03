import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todas las comunas con manejo de errores
export const fetchTodasComunas = createAsyncThunk(
  "comunas/fetchTodasComunas",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/comunas/todas-comunas");
      return response.data.comunas;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener las comunas"
      );
    }
  }
);
