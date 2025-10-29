import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchUsuarios } from "./todosUsuarios";

// Thunk para crear un nuevo usuario
export const crearUsuario = createAsyncThunk(
  "usuarios/crearUsuario",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/usuarios/crear-usuario",
        data.nuevoUsuario
      );

      const usuarioCreado = response.data.usuarios;

      data.notify(response.data.message);

      data.cerrarModal();
      return usuarioCreado;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return rejectWithValue(mensajeError);
    }
  }
);
