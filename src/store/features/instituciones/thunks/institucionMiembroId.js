import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener la institucion a partir del id del miembro
export const fetchInstitucionMiembroId = createAsyncThunk(
  "instituciones/fetchInstitucionMiembroId",
  async (idMiembro, { rejectWithValue }) => {
    try {
      if (!idMiembro) {
        return rejectWithValue(
          "ID de miembro al que pertenece la institucion es requerido"
        );
      }

      const response = await axios.get(
        `/api/instituciones/institucion-miembro-id`,
        {
          params: { idMiembro },
        }
      );

      return response.data.instituciones;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener las instituciones por id miembro"
      );
    }
  }
);
