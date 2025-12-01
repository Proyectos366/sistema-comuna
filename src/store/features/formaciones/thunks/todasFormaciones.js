import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todas las formaciones con manejo de errores
export const fetchFormaciones = createAsyncThunk(
  "formaciones/fetchFormaciones",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/formaciones/todas-formaciones");
      return response.data.formaciones;
    } catch (error) {
      console.log(error?.response?.data?.message);
      return rejectWithValue(
        error?.response?.data?.message || "Error al obtener los formaciones"
      );
    }
  }
);
