import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const asignarDepartamentoUsuario = createAsyncThunk(
  "usuarios/asignarDepartamentoUsuario",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        "/api/usuarios/asignar-al-departamento",
        {
          idUsuario: data.idUsuario,
          idDepartamento: data.idDepartamento,
        },
      );

      data.notify(response?.data?.message);
      data.setAccion("");
      thunkAPI.dispatch(data.cerrarModal("editar"));
      return response?.data?.usuarios;
    } catch (error) {
      data.notify(error?.response?.data?.message);
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Error al asignar departamento",
      );
    }
  },
);
