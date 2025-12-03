// features/comunas/comunasSlice.js
import { createSlice } from "@reduxjs/toolkit";

import { fetchComunasIdParroquia } from "@/store/features/comunas/thunks/comunasIdParroquia";
import { crearComuna } from "@/store/features/comunas/thunks/crearComuna";
import { actualizarComuna } from "@/store/features/comunas/thunks/actualizarComuna";
import { eliminarRestaurarComuna } from "@/store/features/comunas/thunks/eliminarRestaurarComuna";
import { fetchTodasComunas } from "./thunks/todasComunas";

const comunasSlice = createSlice({
  name: "comunas",
  initialState: {
    comunas: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodasComunas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodasComunas.fulfilled, (state, action) => {
        state.loading = false;
        state.comunas = action.payload;
      })
      .addCase(fetchTodasComunas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchComunasIdParroquia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComunasIdParroquia.fulfilled, (state, action) => {
        state.loading = false;
        state.comunas = action.payload;
      })
      .addCase(fetchComunasIdParroquia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(crearComuna.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearComuna.fulfilled, (state, action) => {
        state.loading = false;
        state.comunas.push(action.payload);
      })
      .addCase(crearComuna.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(actualizarComuna.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarComuna.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.comunas.findIndex(
          (comuna) => comuna.id === action.payload.id
        );
        if (index !== -1) {
          state.comunas[index] = action.payload;
        }
      })
      .addCase(actualizarComuna.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(eliminarRestaurarComuna.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarRestaurarComuna.fulfilled, (state, action) => {
        state.loading = false;
        const comunaActualizada = action.payload;

        const index = state.comunas.findIndex(
          (u) => u.id === comunaActualizada.id
        );
        if (index !== -1) {
          state.comunas[index] = comunaActualizada;
        }
      })
      .addCase(eliminarRestaurarComuna.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default comunasSlice.reducer;
