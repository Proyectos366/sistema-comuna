import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk para editar una nueva institucion
export const actualizarInstitucion = createAsyncThunk(
  "instituciones/actualizarInstitucion",
  async (data, thunkAPI) => {
    try {
      const response = await axios.patch(
        "/api/instituciones/actualizar-datos-institucion",
        data.updateInstitucion
      );

      const institucionesUpdate = response.data.instituciones;

      data.notify(response.data.message);

      thunkAPI.dispatch(data.cerrarModal("confirmarCambios"));

      return institucionesUpdate;
    } catch (error) {
      data.notify(error?.response?.data.message);
      const mensajeError =
        error.response?.data?.message || error.message || "Error desconocido";
      return thunkAPI.rejectWithValue(mensajeError);
    }
  }
);
