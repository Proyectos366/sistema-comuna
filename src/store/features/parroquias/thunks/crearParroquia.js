import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para crear una nueva parroquia
export const crearParroquia = createAsyncThunk(
  "parroquias/crearParroquia",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/parroquias/crear-parroquia",
        data.nuevaParroquia
      );

      const parroquiaCreada = response.data.parroquias;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));
      return parroquiaCreada;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
