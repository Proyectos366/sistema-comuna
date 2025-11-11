import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para actualizar una parroquia
export const actualizarParroquia = createAsyncThunk(
  "parroquias/actualizarParroquia",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/parroquias/actualizar-datos-parroquia",
        data.parroquiaActualizada
      );

      const parroquiaUpdate = response.data.parroquias;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));
      return parroquiaUpdate;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
