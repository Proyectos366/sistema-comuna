import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para crear un nuevo municipio
export const crearMunicipio = createAsyncThunk(
  "municipios/crearMunicipio",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/municipios/crear-municipio",
        data.nuevoMunicipio
      );

      const municipioCreado = response.data.municipios;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));
      return municipioCreado;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
