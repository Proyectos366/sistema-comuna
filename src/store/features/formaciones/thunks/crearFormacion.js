import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para crear una nueva formacion
export const crearFormacion = createAsyncThunk(
  "formaciones/crearFormacion",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/formaciones/crear-formacion",
        data.nuevaFormacion
      );

      const formacionCreada = response.data.formaciones;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));
      return formacionCreada;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
