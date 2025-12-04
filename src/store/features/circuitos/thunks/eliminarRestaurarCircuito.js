import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const eliminarRestaurarCircuito = createAsyncThunk(
  "circuitos/eliminarRestaurarCircuito",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/api/circuitos/${!data.estado ? "eliminar" : "restaurar"}-circuito`,
        {
          id_circuito: data.id_circuito,
          estado: data.estado,
        }
      );

      return response?.data?.circuitos;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          `Error al ${data.estado === true ? "eliminar" : "restaurar"} circuito`
      );
    }
  }
);
