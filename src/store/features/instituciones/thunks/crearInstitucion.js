import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchInstituciones } from "./todasInstituciones";

// Thunk para crear un nuevo instituciones
export const crearInstitucion = createAsyncThunk(
  "institucion/crearInstitucion",
  async (nuevaInstitucion, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/instituciones/crear-institucion",
        nuevaInstitucion
      );

      const institucionesCreada = response.data.instituciones;

      // Actualiza la lista completa en segundo plano
      setTimeout(() => {
        dispatch(fetchInstituciones());
      }, 0);

      return institucionesCreada;
    } catch (error) {
      // Manejo de error con fallback
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return rejectWithValue(mensajeError);
    }
  }
);
