import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para crear un nuevo archivo con manejo de errores
export const crearArchivo = createAsyncThunk(
  "archivos/crearArchivo",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/archivos/crear-archivo",
        data.nuevaArchivo,
      );

      const archivoCreado = response.data.archivos;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));
      return archivoCreado;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  },
);
