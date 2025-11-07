import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para actualizar un nuevo estado
export const actualizarEstado = createAsyncThunk(
  "estados/actualizarEstado",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/estados/actualizar-datos-estado",
        data.estadoActualizado
      );

      const estadoActualizado = response.data.estados;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));
      return estadoActualizado;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
