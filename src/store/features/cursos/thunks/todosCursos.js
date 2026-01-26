import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los cursos (formaciones que se han dado) con manejo de errores
export const fetchCursos = createAsyncThunk(
  "cursos/fetchCursos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/cursos/todos-cursos");
      return response.data.cursos;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener los cursos",
      );
    }
  },
);
