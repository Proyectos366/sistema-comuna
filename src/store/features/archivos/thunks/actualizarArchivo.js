import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para editar un nuevo archivo con manejo de errores
export const actualizarArchivo = createAsyncThunk(
  "archivos/actualizarArchivo",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        "/api/archivos/actualizar-datos-archivo",
        data.updateArchivo,
      );

      const archivoUpdate = response.data.archivos;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmarCambios"));

      return archivoUpdate;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  },
);
