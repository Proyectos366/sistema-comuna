import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchUsuarios } from "./todosUsuarios";

// Thunk para crear un nuevo usuario
export const crearUsuario = createAsyncThunk(
  "usuarios/crearUsuario",
  async (nuevoUsuario, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/usuarios/crear-usuario",
        nuevoUsuario
      );

      const usuarioCreado = response.data.usuarios;

      // Actualiza la lista completa en segundo plano
      setTimeout(() => {
        dispatch(fetchUsuarios());
      }, 0);

      return usuarioCreado;
    } catch (error) {
      // Manejo de error con fallback
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return rejectWithValue(mensajeError);
    }
  }
);
