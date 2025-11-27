import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para crear un nuevo departamento
export const crearDepartamento = createAsyncThunk(
  "departamentos/crearDepartamento",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/departamentos/crear-departamento",
        data.nuevoDepartamento
      );

      const departamentoCreado = response.data.departamentos;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));
      return departamentoCreado;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
