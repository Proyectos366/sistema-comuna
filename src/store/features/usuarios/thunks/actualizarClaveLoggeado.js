import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para cambiar o actualizar clave de usuario estando loggeado
export const actualizarClaveUsuarioLoggeado = createAsyncThunk(
  "usuarios/actualizarClaveUsuarioLoggeado",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        "/api/usuarios/cambiar-clave-loggeado",
        data.updateClave,
      );

      const usuariosUpdate = response.data.usuarios;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmarCambios"));

      return usuariosUpdate;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  },
);
