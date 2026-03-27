import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para editar una nueva carpeta con manejo de errores
export const actualizarCarpeta = createAsyncThunk(
  "carpetas/actualizarCarpeta",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        "/api/carpetas/actualizar-datos-carpeta",
        data.updateCarpeta,
      );

      const carpetaUpdate = response.data.carpetas;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmarCambios"));

      return carpetaUpdate;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  },
);
