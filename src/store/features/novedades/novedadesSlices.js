// features/novedades/novedadesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchNovedades } from "@/store/features/novedades/thunks/todasNovedades";
import { crearNovedad } from "@/store/features/novedades/thunks/crearNovedad";
import { actualizarNovedad } from "@/store/features/novedades/thunks/actualizarNovedad";
import { eliminarRestaurarNovedad } from "@/store/features/novedades/thunks/eliminarRestaurarNovedad";

const novedadesSlice = createSlice({
  name: "novedades",
  initialState: {
    novedades: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNovedades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNovedades.fulfilled, (state, action) => {
        state.loading = false;
        state.novedades = action.payload;
      })
      .addCase(fetchNovedades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(crearNovedad.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearNovedad.fulfilled, (state, action) => {
        state.loading = false;
        state.novedades.push(action.payload);
      })
      .addCase(crearNovedad.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(actualizarNovedad.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarNovedad.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.novedades.findIndex(
          (cargo) => cargo.id === action.payload.id,
        );
        if (index !== -1) {
          state.novedades[index] = action.payload;
        }
      })
      .addCase(actualizarNovedad.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(eliminarRestaurarNovedad.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarRestaurarNovedad.fulfilled, (state, action) => {
        state.loading = false;
        const cargoActualizado = action.payload;

        const index = state.novedades.findIndex(
          (u) => u.id === cargoActualizado.id,
        );
        if (index !== -1) {
          state.novedades[index] = cargoActualizado;
        }
      })
      .addCase(eliminarRestaurarNovedad.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default novedadesSlice.reducer;
