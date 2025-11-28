import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const eliminarRestaurarCargo = createAsyncThunk(
  "cargos/eliminarRestaurarCargo",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/api/cargos/${!data.estado ? "eliminar" : "restaurar"}-cargo`,
        {
          id_cargo: data.id_cargo,
          estado: data.estado,
        }
      );

      return response?.data?.cargos;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          `Error al ${data.estado === true ? "eliminar" : "restaurar"} cargo`
      );
    }
  }
);
