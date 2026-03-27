import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const eliminarRestaurarCarpeta = createAsyncThunk(
  "carpetas/eliminarRestaurarCarpeta",
  async (data, thunkAPI) => {
    const { estado, id_carpeta } = data.deleteCarpeta;

    try {
      const response = await axios.patch(
        `/api/carpetas/${!estado ? "eliminar" : "restaurar"}-carpeta`,
        {
          id_carpeta: id_carpeta,
          estado: estado,
        },
      );

      data.notify(response.data.message);
      return response?.data?.carpetas;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          `Error al ${data.estado === true ? "eliminar" : "restaurar"} carpeta`,
      );
    }
  },
);
