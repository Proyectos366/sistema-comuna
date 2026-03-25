import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los estantes por miembro departamento con manejo de errores
export const fetchEstantesDepartamentoMiembro = createAsyncThunk(
  "estantes/fetchEstantesDepartamentoMiembro",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "/api/estantes/estantes-departamento-miembro",
      );
      return response.data.estantes;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener los estantes",
      );
    }
  },
);
