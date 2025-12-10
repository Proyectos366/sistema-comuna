import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener todos los consejos comunales con manejo de errores
export const fetchTodosConsejos = createAsyncThunk(
  "consejos/fetchTodosConsejos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/consejos/todos-consejos");
      return response.data.consejos;
    } catch (error) {
      // Puedes personalizar el mensaje de error según tus necesidades
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al obtener los consejos comunales"
      );
    }
  }
);
