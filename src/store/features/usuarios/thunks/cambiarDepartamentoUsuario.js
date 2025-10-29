import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const cambiarDepartamentoUsuario = createAsyncThunk(
  "usuarios/cambiarDepartamentoUsuario",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        "/api/usuarios/cambiar-al-departamento",
        {
          idUsuario: data.idUsuario,
          idDepartamento: data.idDepartamento,
        }
      );

      data.cerrarModal();
      data.notify(response?.data?.message);
      return response?.data?.usuarios;
    } catch (error) {
      data.notify(error?.response?.data?.message);
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Error al cambiar departamento"
      );
    }
  }
);
