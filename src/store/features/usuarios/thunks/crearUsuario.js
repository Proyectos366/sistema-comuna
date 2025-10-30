import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para crear un nuevo usuario
export const crearUsuario = createAsyncThunk(
  "usuarios/crearUsuario",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/usuarios/crear-usuario",
        data.nuevoUsuario
      );

      const usuarioCreado = response.data.usuarios;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));
      data.setAccion("");
      return usuarioCreado;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
