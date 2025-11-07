import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const eliminarRestaurarEstado = createAsyncThunk(
  "estados/eliminarRestaurarEstado",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/api/estados/${!data.estado ? "eliminar" : "restaurar"}-estado`,
        {
          id_estado: data.id_estado,
          estado: data.estado,
        }
      );

      return response?.data?.estados;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          `Error al ${data.estado === true ? "eliminar" : "restaurar"} estado`
      );
    }
  }
);
