import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los consejos comunales por el idComuna con manejo de errores
export const fetchConsejosIdComuna = createAsyncThunk(
  "consejos/fetchConsejosIdComuna",
  async (idComuna, { rejectWithValue }) => {
    try {
      if (!idComuna) {
        return rejectWithValue("ID de comuna no proporcionado");
      }

      const response = await axios.get(
        `/api/consejos/consejos-comunales-id-comuna`,
        {
          params: { idComuna },
        }
      );

      return response.data.consejos;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener las consejos por id comuna"
      );
    }
  }
);
