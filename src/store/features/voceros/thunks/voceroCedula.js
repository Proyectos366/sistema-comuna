import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para obtener un vocero por el numero de cedula con manejo de errores
export const fetchVoceroCedula = createAsyncThunk(
  "voceros/fetchVoceroCedula",
  async (data, thunkAPI) => {
    try {
      if (!data.voceroCedula.cedula) {
        return rejectWithValue("Cédula en blanco");
      }

      const response = await axios.post(`/api/voceros/vocero-cedula`, {
        cedula: data.voceroCedula.cedula,
      });

      const voceroPorCedula = response.data.voceros;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("consultar"));

      return voceroPorCedula;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message ||
        error.message ||
        "Error al obtener vocero por cédula";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  },
);
