import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para editar un vocero
export const actualizarVocero = createAsyncThunk(
  "voceros/actualizarVocero",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        "/api/voceros/actualizar-datos-vocero",
        data.updateVocero
      );

      const vocerosUpdate = response.data.voceros;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmarCambios"));

      return vocerosUpdate;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
