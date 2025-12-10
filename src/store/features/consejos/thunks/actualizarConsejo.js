import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para editar un consejo comunal
export const actualizarConsejo = createAsyncThunk(
  "consejos/actualizarConsejo",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        "/api/consejos/actualizar-datos-consejo-comunal",
        data.updateConsejo
      );

      const consejosUpdate = response.data.consejos;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmarCambios"));

      return consejosUpdate;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
