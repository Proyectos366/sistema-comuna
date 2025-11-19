import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const eliminarRestaurarInstitucion = createAsyncThunk(
  "instituciones/eliminarRestaurarInstitucion",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/api/instituciones/${
          !data.estado ? "eliminar" : "restaurar"
        }-institucion`,
        {
          id_institucion: data.id_institucion,
          estado: data.estado,
        }
      );

      return response?.data?.instituciones;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          `Error al ${
            data.estado === true ? "eliminar" : "restaurar"
          } institucion`
      );
    }
  }
);
