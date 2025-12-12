import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los voceros por el idConsejo con manejo de errores
export const fetchVocerosIdConsejo = createAsyncThunk(
  "voceros/fetchVocerosIdConsejo",
  async (idConsejo, { rejectWithValue }) => {
    try {
      if (!idConsejo) {
        return rejectWithValue("ID de consejo no proporcionado");
      }

      const response = await axios.get(`/api/voceros/voceros-id-consejo`, {
        params: { idConsejo },
      });

      return response.data.voceros;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener los voceros por id consejo"
      );
    }
  }
);
