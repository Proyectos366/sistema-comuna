import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los voceros por el idParroquia con manejo de errores
export const fetchVocerosIdParroquia = createAsyncThunk(
  "voceros/fetchVocerosIdParroquia",
  async (idParroquia, { rejectWithValue }) => {
    try {
      if (!idParroquia) {
        return rejectWithValue("ID de parroquia no proporcionado");
      }

      const response = await axios.get(`/api/voceros/voceros-id-parroquia`, {
        params: { idParroquia },
      });

      return response.data.voceros;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener los voceros por id parroquia"
      );
    }
  }
);
