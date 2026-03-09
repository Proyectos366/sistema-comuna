import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para editar un nuevo estante
export const actualizarEstante = createAsyncThunk(
  "estantes/actualizarEstante",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        "/api/estantes/actualizar-datos-estante",
        data.updateEstante,
      );

      const estanteUpdate = response.data.estantes;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmarCambios"));

      return estanteUpdate;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  },
);
