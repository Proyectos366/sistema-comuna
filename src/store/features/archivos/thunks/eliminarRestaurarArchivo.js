import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const eliminarRestaurarArchivo = createAsyncThunk(
  "archivos/eliminarRestaurarArchivo",
  async (data, thunkAPI) => {
    const { estado, id_archivo } = data.deleteArchivo;

    try {
      const response = await axios.patch(
        `/api/archivos/${!estado ? "eliminar" : "restaurar"}-archivo`,
        {
          id_archivo: id_archivo,
          estado: estado,
        },
      );

      data.notify(response.data.message);
      return response?.data?.archivos;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          `Error al ${data.estado === true ? "eliminar" : "restaurar"} archivo`,
      );
    }
  },
);
