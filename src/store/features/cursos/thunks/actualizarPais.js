import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para actualizar un nuevo pais
export const actualizarPais = createAsyncThunk(
  "paises/actualizarPais",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/paises/actualizar-datos-pais",
        data.paisActualizado
      );

      const paisActualizado = response.data.paises;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));
      return paisActualizado;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
