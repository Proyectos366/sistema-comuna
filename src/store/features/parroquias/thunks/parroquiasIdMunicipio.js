import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todas las parroquias por el idMunicipio con manejo de errores
export const fetchParroquiasIdMunicipio = createAsyncThunk(
  "parroquias/fetchParroquiasIdMunicipio",
  async (idMunicipio, { rejectWithValue }) => {
    try {
      if (!idMunicipio) {
        return rejectWithValue("ID de parroquia no proporcionado");
      }

      const response = await axios.get(
        `/api/parroquias/parroquias-id-municipio`,
        {
          params: { idMunicipio },
        }
      );

      return response.data.parroquias;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener las parroquias por id municipio"
      );
    }
  }
);
