// features/cargos/cargosSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchCargos } from "@/store/features/cargos/thunks/todosCargos";
import { crearCargo } from "@/store/features/cargos/thunks/crearCargo";
import { actualizarCargo } from "@/store/features/cargos/thunks/actualizarCargo";
import { eliminarRestaurarCargo } from "@/store/features/cargos/thunks/eliminarRestaurarCargo";

const cargosSlice = createSlice({
  name: "cargos",
  initialState: {
    cargos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCargos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCargos.fulfilled, (state, action) => {
        state.loading = false;
        state.cargos = action.payload;
      })
      .addCase(fetchCargos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(crearCargo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearCargo.fulfilled, (state, action) => {
        state.loading = false;
        state.cargos.push(action.payload);
      })
      .addCase(crearCargo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(actualizarCargo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarCargo.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.cargos.findIndex(
          (cargo) => cargo.id === action.payload.id
        );
        if (index !== -1) {
          state.cargos[index] = action.payload;
        }
      })
      .addCase(actualizarCargo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(eliminarRestaurarCargo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarRestaurarCargo.fulfilled, (state, action) => {
        state.loading = false;
        const cargoActualizado = action.payload;

        const index = state.cargos.findIndex(
          (u) => u.id === cargoActualizado.id
        );
        if (index !== -1) {
          state.cargos[index] = cargoActualizado;
        }
      })
      .addCase(eliminarRestaurarCargo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cargosSlice.reducer;
