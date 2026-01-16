import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const eliminarRestaurarPais = createAsyncThunk(
  "paises/eliminarRestaurarPais",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/api/paises/${!data.estado ? "eliminar" : "restaurar"}-pais`,
        {
          id_pais: data.id_pais,
          estado: data.estado,
        }
      );

      return response?.data?.paises;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          `Error al ${data.estado === true ? "eliminar" : "restaurar"} pais`
      );
    }
  }
);
