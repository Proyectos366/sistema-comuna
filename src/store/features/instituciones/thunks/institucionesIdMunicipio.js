import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todas las instituciones por el idMunicipio con manejo de errores
export const fetchInstitucionesIdMunicipio = createAsyncThunk(
  "instituciones/fetchInstitucionesIdMunicipio",
  async (idMunicipio, { rejectWithValue }) => {
    try {
      if (!idMunicipio) {
        return rejectWithValue("ID de municipio no proporcionado");
      }

      const response = await axios.get(
        `/api/instituciones/instituciones-id-municipio`,
        {
          params: { idMunicipio },
        }
      );

      return response.data.instituciones;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener las instituciones por id municipio"
      );
    }
  }
);
