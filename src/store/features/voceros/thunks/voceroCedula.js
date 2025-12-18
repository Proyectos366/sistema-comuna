import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener un vocero por el numero de cedula con manejo de errores
export const fetchVoceroCedula = createAsyncThunk(
  "voceros/fetchVoceroCedula",
  async (cedula, { rejectWithValue }) => {
    try {
      if (!cedula) {
        return rejectWithValue("Cédula en blanco");
      }

      const response = await axios.post(`/api/voceros/vocero-cedula`, {
        cedula: cedula,
      });

      return response.data.voceros;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener el vocero por cédula"
      );
    }
  }
);
