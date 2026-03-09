import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const eliminarRestaurarNovedad = createAsyncThunk(
  "novedades/eliminarRestaurarNovedad",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/api/novedades/${!data.estado ? "eliminar" : "restaurar"}-novedad`,
        {
          id_novedad: data.id_novedad,
          estado: data.estado,
        },
      );

      return response?.data?.novedades;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          `Error al ${data.estado === true ? "eliminar" : "restaurar"} novedad`,
      );
    }
  },
);
