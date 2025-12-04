import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los circuitos por el idParroquia con manejo de errores
export const fetchCircuitosIdParroquia = createAsyncThunk(
  "circuitos/fetchCircuitosIdParroquia",
  async (idParroquia, { rejectWithValue }) => {
    try {
      if (!idParroquia) {
        return rejectWithValue("ID de parroquia no proporcionado");
      }

      const response = await axios.get(
        `/api/circuitos/circuitos-id-parroquia`,
        {
          params: { idParroquia },
        }
      );

      return response.data.circuitos;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener las circuitos por id parroquia"
      );
    }
  }
);
