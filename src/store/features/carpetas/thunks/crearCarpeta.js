import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para crear una nueva carpeta con manejo de errores
export const crearCarpeta = createAsyncThunk(
  "carpetas/crearCarpeta",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/carpetas/crear-carpeta",
        data.nuevaCarpeta,
      );

      const carpetaCreada = response.data.carpetas;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));
      return carpetaCreada;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  },
);
