import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para crear un nuevo estado
export const crearEstado = createAsyncThunk(
  "estados/crearEstado",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/estados/crear-estado",
        data.nuevoEstado
      );

      const estadoCreado = response.data.estados;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));
      return estadoCreado;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
