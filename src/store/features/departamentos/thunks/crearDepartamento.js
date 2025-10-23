import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchDepartamentos } from "./todosDepartamentos";

// Thunk para crear un nuevo departamento
export const crearDepartamento = createAsyncThunk(
  "departamentos/crearDepartamento",
  async (nuevoDepartamento, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/departamentos/crear-departamento",
        nuevoDepartamento
      );

      const departamentoCreado = response.data.departamentos;

      // Actualiza la lista completa en segundo plano
      setTimeout(() => {
        dispatch(fetchDepartamentos());
      }, 0);

      return departamentoCreado;
    } catch (error) {
      // Manejo de error con fallback
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return rejectWithValue(mensajeError);
    }
  }
);
