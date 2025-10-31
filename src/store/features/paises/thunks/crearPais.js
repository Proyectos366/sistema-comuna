import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para crear un nuevo pais
export const crearPais = createAsyncThunk(
  "paises/crearPais",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/paises/crear-pais",
        data.nuevoPais
      );

      const paisCreado = response.data.paises;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));
      data.setAccion("");
      return paisCreado;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
