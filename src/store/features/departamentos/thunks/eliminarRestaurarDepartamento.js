import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const eliminarRestaurarDepartamento = createAsyncThunk(
  "departamentos/eliminarRestaurarDepartamento",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        `/api/departamentos/${
          !data.estado ? "eliminar" : "restaurar"
        }-departamento`,
        {
          id_departamento: data.id_departamento,
          estado: data.estado,
        }
      );

      return response?.data?.departamentos;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          `Error al ${
            data.estado === true ? "eliminar" : "restaurar"
          } departamento`
      );
    }
  }
);
