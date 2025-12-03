import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener la comuna a partir del id del miembro
export const fetchComunaMiembroId = createAsyncThunk(
  "comunas/fetchComunaMiembroId",
  async (idMiembro, { rejectWithValue }) => {
    try {
      if (!idMiembro) {
        return rejectWithValue(
          "ID de miembro al que pertenece la comuna es requerido"
        );
      }

      const response = await axios.get(`/api/comunas/comuna-miembro-id`, {
        params: { idMiembro },
      });

      return response.data.comunas;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener las comunas por id miembro"
      );
    }
  }
);
