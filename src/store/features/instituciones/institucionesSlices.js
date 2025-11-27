// features/instituciones/institucionesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchInstitucionesIdMunicipio } from "@/store/features/instituciones/thunks/institucionesIdMunicipio";
import { crearInstitucion } from "@/store/features/instituciones/thunks/crearInstitucion";
import { actualizarInstitucion } from "@/store/features/instituciones/thunks/actualizarInstitucion";
import { eliminarRestaurarInstitucion } from "@/store/features/instituciones/thunks/eliminarRestaurarInstitucion";
import { fetchTodasInstituciones } from "./thunks/todasInstituciones";

const institucionesSlice = createSlice({
  name: "instituciones",
  initialState: {
    instituciones: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodasInstituciones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodasInstituciones.fulfilled, (state, action) => {
        state.loading = false;
        state.instituciones = action.payload;
      })
      .addCase(fetchTodasInstituciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchInstitucionesIdMunicipio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstitucionesIdMunicipio.fulfilled, (state, action) => {
        state.loading = false;
        state.instituciones = action.payload;
      })
      .addCase(fetchInstitucionesIdMunicipio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(crearInstitucion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearInstitucion.fulfilled, (state, action) => {
        state.loading = false;
        state.instituciones.push(action.payload);
      })
      .addCase(crearInstitucion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(actualizarInstitucion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarInstitucion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.instituciones.findIndex(
          (inst) => inst.id === action.payload.id
        );
        if (index !== -1) {
          state.instituciones[index] = action.payload;
        }
      })
      .addCase(actualizarInstitucion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(eliminarRestaurarInstitucion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarRestaurarInstitucion.fulfilled, (state, action) => {
        state.loading = false;
        const institucionActualizada = action.payload;

        const index = state.instituciones.findIndex(
          (u) => u.id === institucionActualizada.id
        );
        if (index !== -1) {
          state.instituciones[index] = institucionActualizada;
        }
      })
      .addCase(eliminarRestaurarInstitucion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default institucionesSlice.reducer;
