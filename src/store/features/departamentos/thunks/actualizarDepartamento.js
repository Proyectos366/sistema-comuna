import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para editar un nuevo departamento
export const actualizarDepartamento = createAsyncThunk(
  "departamentos/actualizarDepartamento",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        "/api/departamentos/actualizar-datos-departamento",
        data.updateDepartamento
      );

      const departamentosUpdate = response.data.departamentos;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmarCambios"));

      return departamentosUpdate;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
