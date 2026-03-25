import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const eliminarRestaurarEstante = createAsyncThunk(
  "estantes/eliminarRestaurarEstante",
  async (data, thunkAPI) => {
    const { estado, id_estante } = data.deleteEstante;

    try {
      const response = await axios.patch(
        `/api/estantes/${!estado ? "eliminar" : "restaurar"}-estante`,
        {
          id_estante: id_estante,
          estado: estado,
        },
      );

      data.notify(response.data.message);
      return response?.data?.estantes;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          `Error al ${data.estado === true ? "eliminar" : "restaurar"} estante`,
      );
    }
  },
);
