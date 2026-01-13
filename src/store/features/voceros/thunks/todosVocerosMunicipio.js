import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los voceros con manejo de errores
export const fetchVocerosMunicipio = createAsyncThunk(
  "voceros/fetchVocerosMunicipio",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/voceros/todos-voceros-municipio");
      return response.data.voceros;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener los voceros"
      );
    }
  }
);
