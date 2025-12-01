import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para editar una formacion
export const actualizarFormacion = createAsyncThunk(
  "formaciones/actualizarFormacion",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        "/api/formaciones/actualizar-datos-formacion",
        data.updateFormacion
      );

      const formacionesUpdate = response.data.formaciones;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmarCambios"));

      return formacionesUpdate;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
