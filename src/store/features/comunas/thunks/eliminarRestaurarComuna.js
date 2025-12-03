import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const eliminarRestaurarComuna = createAsyncThunk(
  "comunas/eliminarRestaurarComuna",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/api/comunas/${!data.estado ? "eliminar" : "restaurar"}-comuna`,
        {
          id_comuna: data.id_comuna,
          estado: data.estado,
        }
      );

      return response?.data?.comunas;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          `Error al ${data.estado === true ? "eliminar" : "restaurar"} comuna`
      );
    }
  }
);
