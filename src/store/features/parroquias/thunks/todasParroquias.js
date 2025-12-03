import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todas las parroquias con manejo de errores
export const fetchParroquias = createAsyncThunk(
  "parroquias/fetchParroquias",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/parroquias/todas-parroquias");
      return response.data.parroquias;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener los parroquias"
      );
    }
  }
);
