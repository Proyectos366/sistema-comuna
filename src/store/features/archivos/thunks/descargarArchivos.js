import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para descargar un archivo con manejo de errores
export const descargarArchivo = createAsyncThunk(
  "archivos/descargarArchivo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/archivos/descargar-archivo");
      return response.data.archivos;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al descargar el archivo",
      );
    }
  },
);
