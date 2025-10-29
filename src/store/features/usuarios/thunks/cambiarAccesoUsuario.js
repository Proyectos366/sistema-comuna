import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const cambiarAccesoUsuario = createAsyncThunk(
  "usuarios/cambiarAccesoUsuario",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch("/api/usuarios/cambiar-acceso", {
        idUsuario: data.idUsuario,
        validado: data.validado,
      });

      return response?.data?.usuarios;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Error al cambiar acceso"
      );
    }
  }
);
