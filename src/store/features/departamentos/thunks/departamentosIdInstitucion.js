import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los departamentos por el idInstitucion con manejo de errores
export const fetchDepartamentosIdInstitucion = createAsyncThunk(
  "departamentos/fetchDepartamentosIdInstitucion",
  async (idInstitucion, { rejectWithValue }) => {
    try {
      if (!idInstitucion) {
        return rejectWithValue("ID de institucion no proporcionado");
      }

      const response = await axios.get(
        `/api/departamentos/departamentos-id-institucion`,
        {
          params: { idInstitucion },
        }
      );

      return response.data.departamentos;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener los departamentos por id institucion"
      );
    }
  }
);
