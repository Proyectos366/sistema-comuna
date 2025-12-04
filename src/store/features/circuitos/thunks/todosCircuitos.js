import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los circuitos comunales con manejo de errores
export const fetchTodosCircuitos = createAsyncThunk(
  "circuitos/fetchTodosCircuitos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/circuitos/todos-circuitos");
      return response.data.circuitos;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener los circuitos"
      );
    }
  }
);
