import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los voceros por el idCircuito con manejo de errores
export const fetchVocerosIdCircuito = createAsyncThunk(
  "voceros/fetchVocerosIdCircuito",
  async (idCircuito, { rejectWithValue }) => {
    try {
      if (!idCircuito) {
        return rejectWithValue("ID de circuito no proporcionado");
      }

      const response = await axios.get(`/api/voceros/voceros-id-circuito`, {
        params: { idCircuito },
      });

      return response.data.voceros;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener los voceros por id circuito"
      );
    }
  }
);
