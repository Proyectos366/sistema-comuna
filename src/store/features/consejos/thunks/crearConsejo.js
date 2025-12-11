import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para crear un nuevo consejo comunal
export const crearConsejo = createAsyncThunk(
  "consejos/crearConsejo",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/consejos/crear-consejo-comunal",
        data.nuevoConsejo
      );

      const consejoCreado = response.data.consejos;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));
      return consejoCreado;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
