import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para crear un nuevo pais
export const crearInstitucion = createAsyncThunk(
  "instituciones/crearInstitucion",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/instituciones/crear-institucion",
        data.nuevaInstitucion
      );

      const institucionCreada = response.data.instituciones;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));
      return institucionCreada;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
