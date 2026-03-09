import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para crear una nueva novedad
export const crearNovedad = createAsyncThunk(
  "novedades/crearNovedad",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/novedades/crear-novedad",
        data.nuevaNovedad,
      );

      const novedadCreada = response.data.novedades;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));
      return novedadCreada;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  },
);
