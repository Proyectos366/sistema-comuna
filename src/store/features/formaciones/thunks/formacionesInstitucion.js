import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todas las formaciones por institucion con manejo de errores
export const fetchFormacionesInstitucion = createAsyncThunk(
  "formaciones/fetchFormacionesInstitucion",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/formaciones/formaciones-institucion`
      );

      return response.data.formaciones;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener las formaciones por id formacion"
      );
    }
  }
);
