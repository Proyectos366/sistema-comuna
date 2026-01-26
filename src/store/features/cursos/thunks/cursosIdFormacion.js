import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los cursos con manejo de errores
export const fetchCursosIdFormacion = createAsyncThunk(
  "cursos/fetchCursosIdFormacion",
  async (idFormacion, { rejectWithValue }) => {
    try {
      if (!idFormacion) {
        return rejectWithValue("ID de formacion no proporcionado");
      }

      const response = await axios.get("/api/cursos/cursos-id-formacion", {
        params: { idFormacion },
      });
      return response.data.cursos;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener los cursos id formacion",
      );
    }
  },
);
