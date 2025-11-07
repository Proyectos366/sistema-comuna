import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los municipios por el idEstado con manejo de errores
export const fetchMunicipiosIdEstado = createAsyncThunk(
  "municipios/fetchMunicipiosIdEstado",
  async (idEstado, { rejectWithValue }) => {
    try {
      if (!idEstado) {
        return rejectWithValue("ID de estado no proporcionado");
      }

      const response = await axios.get(`/api/municipios/municipios-id-estado`, {
        params: { idEstado },
      });

      return response.data.municipios;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener los municipios por id estado"
      );
    }
  }
);
