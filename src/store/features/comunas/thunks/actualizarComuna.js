import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para editar una nueva comuna
export const actualizarComuna = createAsyncThunk(
  "comunas/actualizarComuna",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        "/api/comunas/actualizar-datos-comuna",
        data.updateComuna
      );

      const comunasUpdate = response.data.comunas;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmarCambios"));

      return comunasUpdate;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
