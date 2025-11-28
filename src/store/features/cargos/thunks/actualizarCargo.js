import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para editar un nuevo cargo
export const actualizarCargo = createAsyncThunk(
  "cargos/actualizarCargo",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        "/api/cargos/actualizar-datos-cargo",
        data.updateCargo
      );

      const cargosUpdate = response.data.cargos;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmarCambios"));

      return cargosUpdate;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
