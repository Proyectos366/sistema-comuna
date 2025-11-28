import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para crear un nuevo cargo
export const crearCargo = createAsyncThunk(
  "cargos/crearCargo",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/cargos/crear-cargo",
        data.nuevoCargo
      );

      const cargoCreado = response.data.cargos;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmar"));
      return cargoCreado;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
