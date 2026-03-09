import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para crear un nuevo estante
export const crearEstante = createAsyncThunk(
  "estantes/crearEstante",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/estantes/crear-estante",
        data.nuevoEstante,
      );

      const estanteCreado = response.data.estantes;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));
      return estanteCreado;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  },
);
