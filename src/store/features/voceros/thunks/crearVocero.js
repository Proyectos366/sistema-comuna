import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para crear un nuevo vocero
export const crearVocero = createAsyncThunk(
  "voceros/crearVocero",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/voceros/crear-vocero",
        data.nuevoVocero
      );

      const voceroCreado = response.data.voceros;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));
      return voceroCreado;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
