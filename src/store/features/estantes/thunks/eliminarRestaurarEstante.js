import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const eliminarRestaurarEstante = createAsyncThunk(
  "estantes/eliminarRestaurarEstante",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/api/estantes/${!data.estado ? "eliminar" : "restaurar"}-estante`,
        {
          id_estante: data.id_estante,
          estado: data.estado,
        },
      );

      return response?.data?.estantes;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          `Error al ${data.estado === true ? "eliminar" : "restaurar"} estante`,
      );
    }
  },
);
