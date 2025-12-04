import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para crear un nuevo circuito
export const crearCircuito = createAsyncThunk(
  "circuitos/crearCircuito",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/circuitos/crear-circuito",
        data.nuevoCircuito
      );

      const circuitoCreado = response.data.circuitos;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));
      return circuitoCreado;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
