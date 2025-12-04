import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener el circuito a partir del id del miembro
export const fetchCircuitoMiembroId = createAsyncThunk(
  "circuitos/fetchCircuitoMiembroId",
  async (idMiembro, { rejectWithValue }) => {
    try {
      if (!idMiembro) {
        return rejectWithValue(
          "ID de miembro al que pertenece el circuito es requerido"
        );
      }

      const response = await axios.get(`/api/circuitos/circuito-miembro-id`, {
        params: { idMiembro },
      });

      return response.data.circuitos;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener los circuitos por id miembro"
      );
    }
  }
);
