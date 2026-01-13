import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener los voceros de un municipio con manejo de errores
export const fetchVocerosPorMunicipio = createAsyncThunk(
  "voceros/fetchVocerosPorMunicipio",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/voceros/voceros-id-municipio");
      return response.data.voceros;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener los voceros"
      );
    }
  }
);
