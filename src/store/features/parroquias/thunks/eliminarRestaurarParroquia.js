import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const eliminarRestaurarParroquia = createAsyncThunk(
  "parroquias/eliminarRestaurarParroquia",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/api/parroquias/${!data.estado ? "eliminar" : "restaurar"}-parroquia`,
        {
          id_parroquia: data.id_parroquia,
          estado: data.estado,
        }
      );

      return response?.data?.parroquias;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          `Error al ${
            data.estado === true ? "eliminar" : "restaurar"
          } parroquia`
      );
    }
  }
);
