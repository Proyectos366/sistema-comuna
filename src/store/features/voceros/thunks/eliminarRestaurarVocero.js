import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const eliminarRestaurarVocero = createAsyncThunk(
  "voceros/eliminarRestaurarVocero",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/api/voceros/${!data.estado ? "eliminar" : "restaurar"}-vocero`,
        {
          id_vocero: data.id_vocero,
          estado: data.estado,
        }
      );

      return response?.data?.voceros;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          `Error al ${data.estado === true ? "eliminar" : "restaurar"} vocero`
      );
    }
  }
);
