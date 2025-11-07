import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const eliminarRestaurarMunicipio = createAsyncThunk(
  "municipios/eliminarRestaurarMunicipio",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/api/municipios/${!data.estado ? "eliminar" : "restaurar"}-municipio`,
        {
          id_municipio: data.id_municipio,
          estado: data.estado,
        }
      );

      return response?.data?.municipios;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          `Error al ${
            data.estado === true ? "eliminar" : "restaurar"
          } municipio`
      );
    }
  }
);
