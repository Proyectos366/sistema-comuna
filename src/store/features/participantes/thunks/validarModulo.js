import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para validar un modulo
export const validarModulo = createAsyncThunk(
  "participantes/validarModulo",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        "/api/asistencias/actualizar-asistencia-modulo",
        data.validarModulo,
      );

      const moduloValidado = response.data.participantes;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmarCambios"));

      return moduloValidado;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  },
);
