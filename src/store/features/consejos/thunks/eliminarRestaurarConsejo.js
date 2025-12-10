import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const eliminarRestaurarConsejo = createAsyncThunk(
  "consejos/eliminarRestaurarConsejo",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/api/consejos/${
          !data.estado ? "eliminar" : "restaurar"
        }-consejo-comunal`,
        {
          id_consejo: data.id_consejo,
          estado: data.estado,
        }
      );

      return response?.data?.consejos;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          `Error al ${
            data.estado === true ? "eliminar" : "restaurar"
          } consejo comunal`
      );
    }
  }
);
