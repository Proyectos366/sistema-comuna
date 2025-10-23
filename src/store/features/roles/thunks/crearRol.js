import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchRoles } from "./todosRoles";

// Thunk para crear un nuevo roles
export const crearRol = createAsyncThunk(
  "rol/crearRol",
  async (nuevoRol, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post("/api/roles/crear-rol", nuevoRol);

      const rolCreado = response.data.roles;

      // Actualiza la lista completa en segundo plano
      setTimeout(() => {
        dispatch(fetchRoles());
      }, 0);

      return rolCreado;
    } catch (error) {
      // Manejo de error con fallback
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return rejectWithValue(mensajeError);
    }
  }
);
