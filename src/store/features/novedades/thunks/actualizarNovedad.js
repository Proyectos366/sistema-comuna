import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para editar una nueva novedad
export const actualizarNovedad = createAsyncThunk(
  "novedades/actualizarNovedad",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        "/api/novedades/actualizar-datos-novedad",
        data.updateNovedad,
      );

      const novedadesUpdate = response.data.novedades;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmarCambios"));

      return novedadesUpdate;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  },
);
