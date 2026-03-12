import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los estantes por el idDepartamento con manejo de errores
export const fetchEstantesIdDepartamento = createAsyncThunk(
  "estantes/fetchEstantesIdDepartamento",
  async (idDepartamento, { rejectWithValue }) => {
    try {
      if (!idDepartamento) {
        return rejectWithValue("ID de departamento no proporcionado");
      }

      const response = await axios.get(
        `/api/estantes/estantes-id-departamento`,
        {
          params: { idDepartamento },
        },
      );

      return response.data.estantes;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener las estantes por id departamento",
      );
    }
  },
);
