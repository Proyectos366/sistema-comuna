import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los consejos comunales por el idCircuito con manejo de errores
export const fetchConsejosIdCircuito = createAsyncThunk(
  "consejos/fetchConsejosIdCircuito",
  async (idCircuito, { rejectWithValue }) => {
    try {
      if (!idCircuito) {
        return rejectWithValue("ID de circuito no proporcionado");
      }

      const response = await axios.get(
        `/api/consejos/consejos-comunales-id-circuito`,
        {
          params: { idCircuito },
        }
      );

      return response.data.consejos;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener las consejos por id circuito"
      );
    }
  }
);
