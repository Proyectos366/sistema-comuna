import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const eliminarRestaurarFormacion = createAsyncThunk(
  "formaciones/eliminarRestaurarFormacion",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/api/formaciones/${!data.estado ? "eliminar" : "restaurar"}-formacion`,
        {
          id_formacion: data.id_formacion,
          estado: data.estado,
        }
      );

      return response?.data?.formaciones;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          `Error al ${
            data.estado === true ? "eliminar" : "restaurar"
          } formacion`
      );
    }
  }
);
