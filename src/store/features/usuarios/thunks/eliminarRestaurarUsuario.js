import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const eliminarRestaurarUsuario = createAsyncThunk(
  "usuarios/eliminarRestaurarUsuario",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/api/usuarios/${!data.estado ? "eliminar" : "restaurar"}-usuario`,
        {
          id_usuario: data.id_usuario,
          estado: data.estado,
        }
      );

      return response?.data?.usuarios;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          `Error al ${data.estado === true ? "eliminar" : "restaurar"} acceso`
      );
    }
  }
);
