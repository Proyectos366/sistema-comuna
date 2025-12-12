import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los voceros por el idComuna con manejo de errores
export const fetchVocerosIdComuna = createAsyncThunk(
  "voceros/fetchVocerosIdComuna",
  async (idComuna, { rejectWithValue }) => {
    try {
      if (!idComuna) {
        return rejectWithValue("ID de comuna no proporcionado");
      }

      const response = await axios.get(`/api/voceros/voceros-id-comuna`, {
        params: { idComuna },
      });

      return response.data.voceros;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener los voceros por id comuna"
      );
    }
  }
);
