import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los consejos comunales por el idParroquia con manejo de errores
export const fetchConsejosIdParroquia = createAsyncThunk(
  "consejos/fetchConsejosIdParroquia",
  async (idParroquia, { rejectWithValue }) => {
    try {
      if (!idParroquia) {
        return rejectWithValue("ID de parroquia no proporcionado");
      }

      const response = await axios.get(
        `/api/consejos/consejos-comunales-id-parroquia`,
        {
          params: { idParroquia },
        }
      );

      return response.data.consejos;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener las consejos por id parroquia"
      );
    }
  }
);
